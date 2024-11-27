import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './event.model';
import { AuthModule } from 'src/auth/auth.module';
import { EventGateway } from './event.gateway';
// import { BotModule } from 'src/bot/bot.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]), 
    forwardRef(() => AuthModule), 
    // forwardRef(() => BotModule)
  ],
  controllers: [],
  providers: [EventService, EventGateway],
  exports: [EventService]
})
export class EventModule {}
