import { UseGuards } from '@nestjs/common'
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ScreenService } from '../screen/screen.service'
import { BotService } from 'src/bot/bot.service'

@WebSocketGateway(
  {
      cors:{
        origin:'*'
    }
  }
)

export class ScreenGateway {

  constructor(
    private screenSevice: ScreenService,
    private botSevice: BotService
  ) {}

  
  @WebSocketServer() server: Server;

  @SubscribeMessage('updateScreenInfo')
  async testServerBot(client: Socket, payload: any): Promise<void> {
    if(payload.token === process.env.SERVER_TOKEN && global['connectUsers'][payload.botId]){
      const res = await this.screenSevice.getScreens(payload.botId)
      this.server.to(global['connectUsers'][payload.botId]).emit('getScreens', res)
    }
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('deleteScreen')
  async deleteScreen(client: Socket, payload: any): Promise<void> {
    await this.screenSevice.deleteScreen(payload)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('protectScrreen')
  async protectScrreen(client: Socket, payload: any): Promise<void> {
    await this.screenSevice.protectScrreen(payload.botId, payload.screenId, payload.status)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('editScreenName')
  async editScreenName(client: Socket, payload: any): Promise<void> {
    await this.screenSevice.editScreenName(payload.botId, payload.screenId, payload.name)
    const res = await this.screenSevice.getScreens(payload.botId)
    this.server.to(client.id).emit('getScreens', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('deleteContentItem')
  async deleteContentItem(client: Socket, payload: any): Promise<void> {
    await this.screenSevice.deleteContentItem(payload.botId, payload.screenId, payload.content, payload.index)
    const res = await this.screenSevice.getScreens(payload.botId)
    this.server.to(client.id).emit('getScreens', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('addContentItem')
  async addContentItem(client: Socket, payload: any): Promise<void> {
    await this.screenSevice.addContentItem(payload.botId, payload.screenId, payload.content)
    const res = await this.screenSevice.getScreens(payload.botId)
    this.server.to(client.id).emit('getScreens', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('editButtons')
  async editButtons(client: Socket, payload: any): Promise<void> {
    await this.screenSevice.editButtons(payload.botId, payload.screenId, payload.buttons)
    const res = await this.screenSevice.getScreens(payload.botId)
    this.server.to(client.id).emit('getScreens', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('updateVariable')
  async updateVariable(client: Socket, payload: any): Promise<void> {
    await this.screenSevice.updateVariable(payload.botId, payload.screenId, payload.variable)
    const res = await this.screenSevice.getScreens(payload.botId)
    this.server.to(client.id).emit('getScreens', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('screenForAnswer')
  async screenForAnswer(client: Socket, payload: any): Promise<void> {
    await this.screenSevice.screenForAnswer(payload.botId, payload.screenId, payload.ansScreen)
    const res = await this.screenSevice.getScreens(payload.botId)
    this.server.to(client.id).emit('getScreens', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createNewScreen')
  async createNewScreen(client: Socket, payload: any): Promise<void> {
    await this.screenSevice.createNewScreen(payload.botId, payload.screenName)
    const res = await this.screenSevice.getScreens(payload.botId)
    this.server.to(client.id).emit('getScreens', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createEventScreen')
  async createEventScreen(client: Socket, payload: any): Promise<void> {
    await this.screenSevice.createEventScreen(payload.botId, payload.screenName, payload.idEvent)
    const res = await this.screenSevice.getScreens(payload.botId)
    this.server.to(client.id).emit('getScreens', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('clearScreen')
  async clearScreen(client: Socket, payload: any): Promise<void> {
    await this.screenSevice.clearScreen(payload.botId, payload.screenId)
    const res = await this.screenSevice.getScreens(payload.botId)
    this.server.to(client.id).emit('getScreens', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('copyScreen')
  async copyScreen(client: Socket, payload: any): Promise<void> {
    await this.screenSevice.copyScreen(payload.botId, payload.screenId)
    const res = await this.screenSevice.getScreens(payload.botId)
    this.server.to(client.id).emit('getScreens', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('getScreens')
  async getScreens(client: Socket, payload: any): Promise<void> {
    const res = await this.screenSevice.getScreens(payload)
    this.server.to(client.id).emit('getScreens', res)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('sendMeScreen')
  async sendMeScreen(client: Socket, payload: any): Promise<void> {
    const user = client['user']
    this.server.to(process.env.SERVER_ROOM).emit('sendMeScreen', {userId: user.id, screenId: payload.screenId, botId: payload.botId})
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('sendScreenToUser')
  async sendScreenToUser(client: Socket, payload: any): Promise<void> {
    // const user = client['user']
    this.server.to(process.env.SERVER_ROOM).emit('sendScreenToUser', {userId: payload.to, screenId: payload.screenId, botId: payload.botId})
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('sendTextToUser')
  async sendTextToUser(client: Socket, payload: any): Promise<void> {
    // const user = client['user']
    this.server.to(process.env.SERVER_ROOM).emit('sendTextToUser', {userId: payload.to, text: payload.text, botId: payload.botId})
  }


}
