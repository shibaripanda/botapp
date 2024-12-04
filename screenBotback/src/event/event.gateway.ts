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

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('getEvent')
  async getEvent(client: Socket, payload: any): Promise<void> {
    const res = await this.eventSevice.getEvent(payload)
    this.server.to(client.id).emit(`getEvent|${res['idEvent']}`, res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('deleteUserRegistration')
  async deleteUserRegistration(client: Socket, payload: any): Promise<void> {
    console.log(payload)
    const res = await this.eventSevice.deleteUserRegistration(payload)
    console.log(res)
    // this.server.to(client.id).emit(`getEvent|${res['idEvent']}`, res)
  }

}
