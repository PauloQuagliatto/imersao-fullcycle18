import { Injectable } from '@nestjs/common';
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '@app/core/prisma/prisma.service';
import { ReserveSpotDto } from './dto/reserve-spot.dto';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}
  create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
      },
    });
  }

  findAll() {
    return `This action returns all events`;
  }

  findOne(id: string) {
    return this.prismaService.event.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.prismaService.event.update({
      where: {
        id,
      },
      data: {
        ...updateEventDto,
        date: new Date(updateEventDto.date),
      },
    });
  }

  remove(id: string) {
    return this.prismaService.event.delete({
      where: {
        id,
      },
    });
  }

  async reserveSpot(dto: ReserveSpotDto & { eventId: string }) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId: dto.eventId,
        name: {
          in: dto.spots,
        },
      },
    });

    if (spots.length !== dto.spots.length) {
      const foundSpotsNames = spots.map((spot) => spot.name);
      const notFoundSpotsNames = dto.spots.filter(
        (spotName) => !foundSpotsNames.includes(spotName),
      );
      throw new Error(`Spots ${notFoundSpotsNames.join(', ')} not found`);
    }

    try {
      const tickets = await this.prismaService.$transaction(
        async (tx) => {
          await tx.reservationHistory.createMany({
            data: spots.map((spot) => ({
              spotId: spot.id,
              ticketKind: dto.ticket_kind,
              email: dto.email,
              status: TicketStatus.reserved,
            })),
          });

          await tx.spot.updateMany({
            where: {
              id: {
                in: spots.map((spot) => spot.id),
              },
            },
            data: {
              status: SpotStatus.reserved,
            },
          });

          const tickets = await Promise.all(
            spots.map((spot) =>
              tx.ticket.create({
                data: {
                  spotId: spot.id,
                  ticketKind: dto.ticket_kind,
                  email: dto.email,
                },
              }),
            ),
          );

          return tickets;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );

      return tickets;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2002':
            throw new Error('Spot already reserved');
          case 'P2034':
            throw new Error('Some spots are already reserved');
        }
      }

      throw e;
    }
  }
}
