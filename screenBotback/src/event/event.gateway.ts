import { UseGuards } from '@nestjs/common'
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { BotService } from 'src/bot/bot.service'
import { EventService } from './event.service'

@WebSocketGateway(
  {
      cors:{
        origin:'*'
    }
  }
)

export class EventGateway {

  constructor(
    private eventSevice: EventService,
    private botSevice: BotService
  ) {}

  
  @WebSocketServer() server: Server;

  @SubscribeMessage('updateScreenInfo')
  async testServerBot(client: Socket, payload: any): Promise<void> {
    if(payload.token === process.env.SERVER_TOKEN && global['connectUsers'][payload.botId]){
      // const res = await this.screenSevice.getScreens(payload.botId)
      // this.server.to(global['connectUsers'][payload.botId]).emit('getScreens', res)
    }
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('deleteScreen')
  async deleteScreen(client: Socket, payload: any): Promise<void> {
    console.log(client)
    console.log(payload)
    // await this.screenSevice.deleteScreen(payload)
  }

}
