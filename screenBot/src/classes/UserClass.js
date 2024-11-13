import { Screen } from "../models/screen.js"
import { User } from "../models/user.js"
import { SocketApt } from "../socket/api/socket-api.js"


export class UserClass {

    constructor(user, botId) {
        this.user = user
        this.id =  user.id,
        this.first_name = user.first_name,
        this.username = user.username,
        this.language = user.language
        this.botId = botId
        this.activBot = user.activBot[botId]
        this.data = user.data[botId]
        this.screen = user.screen[botId]
    }

    async updateToClient(){
        SocketApt.socket.emit('updateUserToClient', {botId: this.botId, token: process.env.SERVER_TOKEN})
    }

    async updateScreen(screenId){
        this.screen = screenId
        const screen = `screen.${this.botId}`
        await this.user.updateOne({[screen]: screenId})
    }

    async updateData(info){
        this.data[await this.getCurrentVariable()] = info
        const data = `data.${this.botId}`
        await this.user.updateOne({[data]: this.data})
    }

    async getCurrentVariable(){
        if(this.screen === 'Start screen'){
           const variable = await Screen.findOne({name: this.screen, owner: this.botId})
           return variable.variable 
        }
        const variable = await Screen.findOne({_id: this.screen, owner: this.botId})
        return variable.variable 
    }

    async getScreenForAns(){
        if(this.screen === 'Start screen'){
           const screen = await Screen.findOne({name: this.screen, owner: this.botId})
           return {screen: screen, status: screen.ansScreen}
        }
        const screen = await Screen.findOne({_id: this.screen, owner: this.botId})
        return {screen: screen, status: screen.ansScreen}
    }

    async updateStatusInBot(status){
        const link = `activBot.${this.botId}`
        if(status === 'kicked') await this.user.updateOne({[link]: false})
        else if (status === 'member') await this.user.updateOne({[link]: true})
    } 
    
}