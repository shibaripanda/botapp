import { UseGuards } from '@nestjs/common'
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { BotService } from '../bot/bot.service'

@WebSocketGateway(
  {
      cors:{
        origin:'*'
    }
  }
)

export class BotGateway {

  constructor(
    private botSevice: BotService
  ) {}

  
  @WebSocketServer() server: Server;

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createNewBot')
  async createNewBot(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    const res = await this.botSevice.createBot(user.id, payload)
    this.server.to(client.id).emit('createNewBot', res)
    if(res === 'Bot created! ✅'){
      const bots = await this.botSevice.getBots(user.id)
      this.server.to(client.id).emit('getMyBots', bots)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('updateEvent')
  async updateEvent(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    const res = await this.botSevice.updateEvent(user.id, payload.botId, payload.event, payload.newEvent)
    this.server.to(client.id).emit('getEvents', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('deleteEvent')
  async deleteEvent(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    const res = await this.botSevice.deleteEvent(user.id, payload.botId, payload.event)
    this.server.to(client.id).emit('getEvents', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createEvent')
  async createEvent(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    const res = await this.botSevice.createEvent(user.id, payload.botId, payload.event)
    this.server.to(client.id).emit('getEvents', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('getEvents')
  async getEvents(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    const res = await this.botSevice.getEvents(user.id, payload)
    this.server.to(client.id).emit('getEvents', res)
  }

  @SubscribeMessage('updateContentInfo')
  async testServerBot(client: Socket, payload: any): Promise<void> {
    if(payload.token === process.env.SERVER_TOKEN && global['connectUsers'][payload.botId]){
      const res = await this.botSevice.getContentFromBot(payload.botId)
      this.server.to(global['connectUsers'][payload.botId]).emit('getContent', res)
    }
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('sendMeContent')
  async sendMeScreen(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    this.server.to(process.env.SERVER_ROOM).emit('sendMeContent', {userId: user.id, botId: payload.botId, content: payload.content})
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('sendContentToUser')
  async sendContentToUser(client: Socket, payload: any): Promise<void> {
    // const user = client['user']
    this.server.to(process.env.SERVER_ROOM).emit('sendMeContent', {userId: payload.userId, botId: payload.botId, content: payload.content})
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('idForEditScreen')
  async idForEditScreen(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    global['connectUsers'][payload.botId] = client.id
    await this.botSevice.idForEditScreen(user.id, payload.botId, payload.screenId)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('getBot')
  async getBot(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    const res = await this.botSevice.getBot(user.id, payload)
    this.server.to(client.id).emit('getBot', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('renameGroup')
  async renameGroup(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    const res = await this.botSevice.renameGroup(user.id, payload.botId, payload.group, payload.newName)
    this.server.to(client.id).emit('getGroups', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('deleteGroup')
  async deleteGroup(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    const res = await this.botSevice.deleteGroup(user.id, payload.botId, payload.group)
    this.server.to(client.id).emit('getGroups', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createGroup')
  async createGroup(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    const res = await this.botSevice.createGroup(user.id, payload.botId, payload.group)
    this.server.to(client.id).emit('getGroups', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('getContent')
  async getContent(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    const res = await this.botSevice.getContent(user.id, payload)
    this.server.to(client.id).emit('getContent', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('getGroups')
  async getGroups(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    const res = await this.botSevice.getGroups(user.id, payload)
    this.server.to(client.id).emit('getGroups', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('deleteContent')
  async deleteContent(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    const res = await this.botSevice.deleteContent(user.id, payload.botId, payload.content)
    this.server.to(client.id).emit('getContent', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('renameMeContent')
  async renameMeContent(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    const res = await this.botSevice.renameMeContent(user.id, payload.botId, payload.content, payload.newName)
    this.server.to(client.id).emit('getContent', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('getAddContentMode')
  async getAddContentMode(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    const res = await this.botSevice.getAddContentMode(user.id, payload)
    console.log(res)
    this.server.to(client.id).emit('getAddContentMode', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('getMyBots')
  async getBots(client: Socket): Promise<void> {
    const user = client['user']
    const res = await this.botSevice.getBots(user.id)
    this.server.to(client.id).emit('getMyBots', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('deleteBot')
  async deleteBot(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    this.server.to(process.env.SERVER_ROOM).emit('offBot', payload)
    await this.botSevice.deleteBot(user.id, payload)
    const res = await this.botSevice.getBots(user.id)
    this.server.to(client.id).emit('getMyBots', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('offBot')
  async offBot(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    await this.botSevice.offBot(user.id, payload)
    const res = await this.botSevice.getBots(user.id)
    this.server.to(client.id).emit('getMyBots', res)
    this.server.to(process.env.SERVER_ROOM).emit('offBot', payload)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('onBot')
  async onBot(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    await this.botSevice.onBot(user.id, payload)
    const res = await this.botSevice.getBots(user.id)
    this.server.to(client.id).emit('getMyBots', res)
    this.server.to(process.env.SERVER_ROOM).emit('onBot', payload)
  }

}
