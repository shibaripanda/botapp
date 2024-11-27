import { forwardRef, Module } from '@nestjs/common';
import { ScreenController } from './screen.controller';
import { ScreenService } from './screen.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScreenSchema } from './screen.model';
import { AuthModule } from 'src/auth/auth.module';
import { ScreenGateway } from './screen.gateway';
import { BotModule } from 'src/bot/bot.module';
// import { BotService } from 'src/bot/bot.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Screen', schema: ScreenSchema }]), forwardRef(() => AuthModule),  forwardRef(() => BotModule)],
  controllers: [ScreenController],
  providers: [ScreenService, ScreenGateway],
  exports: [ScreenService]
})
export class ScreenModule {}
