// import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { AppService } from 'src/app.service';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersService } from './users/users.service';
import { BotService } from './bot/bot.service';
// import { CreateMessDto } from 'src/dto/create-mess.dto';

@WebSocketGateway(
  {
      cors:{
        origin:'*'
    }
  }
)

export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private usersService: UsersService,
    private botSevice: BotService
  ) {}

  
  
  @WebSocketServer() server: Server;

  @SubscribeMessage('helloFromServer')
  async testServerBot(client: Socket, payload: any): Promise<void> {
    if(payload === process.env.SERVER_TOKEN){
      process.env.SERVER_ROOM = client.id
    }
  }

  afterInit() {
    console.log('WebSocket server start')
  }
  handleConnection(client: Socket) {
    console.log('connect', client.id)
  }
  handleDisconnect(client: Socket) {
    console.log('dicconnect', client.id)
  }
}
