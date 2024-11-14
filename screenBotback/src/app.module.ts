import { Module } from '@nestjs/common'
// import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { AppGateway } from './app.gateway'
import { BotModule } from './bot/bot.module';
// import { BotService } from './bot/bot.service'
import { ScreenModule } from './screen/screen.module';
import { AppSchema } from './app.model'
import { AppController } from './app.controller'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'App', schema: AppSchema }]),
    MongooseModule.forRoot(process.env.MONGO_TOKEN), 
    UsersModule, 
    BotModule,
    AuthModule,
    ScreenModule
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
