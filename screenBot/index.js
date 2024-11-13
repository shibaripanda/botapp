import 'dotenv/config'
import { db } from './src/db/db.js'
import { AppClass } from './src/classes/AppClass.js'
import { useConnectSocket } from './src/socket/hooks/useConnectSocket.js'
import { SocketApt } from './src/socket/api/socket-api.js'
import { startBots } from './src/modules/startBots.js'


async function startBot(){
    try{
        const status = await db()
        const bots = []
        const app = new AppClass()
        useConnectSocket()

        SocketApt.socket.on('onBot', async (data) => {
            await app.startBot(bots, data)
        })
        SocketApt.socket.on('getBot', (data) => {
            console.log(data)
        })
        SocketApt.socket.on('offBot', async (data) => {
            await app.stopBot(bots, data)
        })
        SocketApt.socket.on('sendMeScreen', async (data) => {
            const botModule = bots.find(item => item._id == data.botId)
            await botModule.updateBotData()

            const screen = await botModule.getScreen(data.screenId)
            await botModule.message(screen, data.userId)

            console.log('sendMeScreen')
        })
        SocketApt.socket.on('sendMeContent', async (data) => {
            const botModule = bots.find(item => item._id == data.botId)
            await botModule.updateBotData()

            await botModule.messageContent(data.userId, data.content)

            console.log('sendMeContent')
        })
        SocketApt.socket.on('sendScreenToUser', async (data) => {
            const botModule = bots.find(item => item._id == data.botId)
            await botModule.updateBotData()
            
            const screen = await botModule.getScreen(data.screenId)
            await botModule.message(screen, data.userId)

            await app.updateMonitScreen(data.userId, data.botId, data.screenId)
            await app.updateToClientMonit(data.botId)
            console.log('sendScreenToUser')
        })
        SocketApt.socket.on('sendTextToUser', async (data) => {
            const botModule = bots.find(item => item._id == data.botId)
            await botModule.updateBotData()
            await botModule.bot.telegram.sendMessage(data.userId, data.text, {protect_content: true, parse_mode: 'HTML'}).catch(error => console.log(error))
            console.log('sendTextToUser')
        })

        if(status){
            const appContext = await app.getAllActiveBots()
            if(appContext.length){
                for(const i of appContext){
                    await startBots(i, bots)
                }
            }
            else{
                console.log('Хер там... Активных ботов нет...')
            } 
        }
        else{
            console.log('Хер там... База не подключается...')
        }
    }
    catch(error){
        console.log('Ошибка запуска бота...')
        console.log(error)
    }
}

startBot()