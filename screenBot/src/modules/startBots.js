import { Telegraf } from 'telegraf'
import { BotClass } from '../classes/BotClass.js'
import { botStart } from '../triggers/botStart.js'
import { botChatMember } from '../triggers/botChatMember.js'
import { botCommands } from '../triggers/botCommands.js'
import { botMessage } from '../triggers/botMessage.js'
import { botCallback } from '../triggers/botCallback.js'

export const startBots = async (i, bots) => {
    const option = {allowedUpdates: ['my_chat_member', 'chat_member', 'callback_query', 'message', 'channel_post'], dropPendingUpdates: true}
    
    const bot = new Telegraf(i.token)
    const botModule = new BotClass(bot, i)
    await botStart(botModule)
    await botChatMember(botModule)
    // await botCommands(botModule)
    await botMessage(botModule)
    await botCallback(botModule)
    botModule.bot.launch(option).catch((error) => {
        console.log(botModule.username, '\n', error)
    })
    bots.push(botModule)
    process.once('SIGINT', () => botModule.bot.stop('SIGINT'))
    process.once('SIGTERM', () => botModule.bot.stop('SIGTERM'))
    console.log('Start bot:', botModule.username)
}
