import { forwardRef, Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BotSchema } from './bot.model';
import { AuthModule } from 'src/auth/auth.module';
import { BotGateway } from './bot.gateway';
import { ScreenModule } from 'src/screen/screen.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Bot', schema: BotSchema }]), forwardRef(() => AuthModule), ScreenModule],
  controllers: [BotController],
  providers: [BotService, BotGateway],
  exports: [BotService]
})
export class BotModule {}
