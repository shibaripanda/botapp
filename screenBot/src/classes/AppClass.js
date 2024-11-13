import { Bot } from "../models/bot.js"
import { User } from "../models/user.js"
import { startBots } from "../modules/startBots.js"
import { SocketApt } from "../socket/api/socket-api.js"

export class AppClass {

    constructor(){}

    async stopBot(bots, data) {
        const stopBot = bots.find(item => item._id == data)
        if(stopBot){
            stopBot.bot.stop()
            console.log('Stop bot:', stopBot.name)
            bots.splice(bots.findIndex(item => item._id == data), 1)  
        }
    }

    async startBot(bots, data) {
        const newBot = await this.getBot(data)
        await startBots(newBot, bots)
    }

    async getAllActiveBots() {
        return await Bot.find({status: true})
    }

    async getBot(_id) {
        return await Bot.findOne({_id: _id})
    }

    async getUser(id) {
        return await User.findOne({id: id})
    }

    async updateMonitScreen(userId, botId, screenId){
        const screen = `screen.${botId}`
        await User.updateOne({id: userId}, {[screen]: screenId})
    }

    async updateToClientMonit(botId){
        SocketApt.socket.emit('updateUserToClient', {botId: botId, token: process.env.SERVER_TOKEN})
    }

}