import { PartialType } from '@nestjs/mapped-types';
import { CreateSpotsRequest } from './create-spot.request';

export class UpdateSpotsRequest extends PartialType(CreateSpotsRequest) {}
