import { Injectable } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { PrismaService } from '@app/core/prisma/prisma.service';

@Injectable()
export class SpotsService {
  constructor(private prismaService: PrismaService) {}
  create(createSpotDto: CreateSpotDto & { eventId: string }) {
    return this.prismaService.spot.create({
      data: {
        ...createSpotDto,
        status: 'available',
      },
    });
  }

  findAll(eventId: string) {
    return this.prismaService.spot.findMany({
      where: { eventId },
    });
  }

  findOne(eventId: string, id: string) {
    return this.prismaService.spot.findMany({
      where: { eventId, id },
    });
  }

  update(eventId: string, id: string, updateSpotDto: UpdateSpotDto) {
    return this.prismaService.spot.update({
      where: { eventId, id },
      data: {
        ...updateSpotDto,
        status: 'reserved',
      },
    });
  }

  remove(eventId: string, id: string) {
    return this.prismaService.spot.delete({
      where: { eventId, id },
    });
  }
}
