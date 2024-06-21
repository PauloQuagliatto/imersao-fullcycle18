import { SpotStatus } from '@prisma/client';

export class CreateSpotsRequest {
  name: string;
  status: SpotStatus;
}
