import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SpotsService } from '@app/core/spots/spots.service';
import { CreateSpotsRequest } from './dto/create-spot.request';
import { UpdateSpotsRequest } from './dto/update-spot.request';

@Controller('events/:eventId/spot')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(
    @Param('eventId') eventId: string,
    @Body() createSpotsRequest: CreateSpotsRequest,
  ) {
    return this.spotsService.create({
      eventId,
      ...createSpotsRequest,
    });
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.spotsService.findAll(eventId);
  }

  @Get(':id')
  findOne(@Param('eventId') eventId: string, @Param('id') id: string) {
    return this.spotsService.findOne(eventId, id);
  }

  @Patch(':id')
  update(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @Body() updateSpotsRequest: UpdateSpotsRequest,
  ) {
    return this.spotsService.update(eventId, id, updateSpotsRequest);
  }

  @Delete(':id')
  remove(@Param('eventId') eventId: string, @Param('id') id: string) {
    return this.spotsService.remove(eventId, id);
  }
}
