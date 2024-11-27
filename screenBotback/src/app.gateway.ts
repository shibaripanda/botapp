import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'

@WebSocketGateway(
  {
      cors:{
        origin:'*'
    }
  }
)

export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
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
