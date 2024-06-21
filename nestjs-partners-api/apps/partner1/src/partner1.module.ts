import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { SpotsModule } from './spots/spots.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@app/core/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.partner1', isGlobal: true }),
    EventsModule,
    AuthModule,
    SpotsModule,
  ],
})
export class Partner1Module {}
