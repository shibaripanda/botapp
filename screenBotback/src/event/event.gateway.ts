import { UseGuards } from '@nestjs/common'
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
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
    private eventSevice: EventService
  ) {}

  @WebSocketServer() server: Server

  @SubscribeMessage('updateEventInfo')
  async testServerBot(client: Socket, payload: any): Promise<void> {
    if(payload.token === process.env.SERVER_TOKEN && global['connectUsers'][payload.botId]){
      const res = await this.eventSevice.getEvent(payload.idEvent)
      this.server.to(global['connectUsers'][payload.botId]).emit(`getEvent|${res['idEvent']}`, res)
    }
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('getEvent')
  async getEvent(client: Socket, payload: any): Promise<void> {
    global['connectUsers'][payload.botId] = client.id
    const res = await this.eventSevice.getEvent(payload.idEvent)
    this.server.to(client.id).emit(`getEvent|${res['idEvent']}`, res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('deleteUserRegistration')
  async deleteUserRegistration(client: Socket, payload: any): Promise<void> {
    const res = await this.eventSevice.deleteUserRegistration(payload)
    this.server.to(client.id).emit(`getEvent|${res['idEvent']}`, res)
  }

}
