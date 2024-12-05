import { getUser } from "../modules/getUser.js"

export const botCallback = async (botModule) => {
    try{
        botModule.bot.on('callback_query', async (ctx) => {
            console.log('current mes', ctx.update.callback_query.message.date)
            const user = await getUser(ctx.from, botModule._id)
            console.log('user mes', user.updateTime)

            if(ctx.update.callback_query.data.split('|')[0] !== 'zero' && (ctx.update.callback_query.message.date >= user.updateTime || user.updateTime === 0)){
                const screen = await botModule.getScreen(ctx.update.callback_query.data.split('|')[0])
                if(screen){
                    
                    const time = await botModule.message(screen, ctx.update.callback_query.from.id, user.data, ctx.update.callback_query.data.split('|'))
                    await user.updateTimePoint(time)
                    await user.updateScreen(ctx.update.callback_query.data)
                    await user.updateToClient()
                }
                else{
                    await botModule.errorMessage(ctx.update.callback_query.from.id) 
                }
            }
            else{
                botModule.bot.telegram.answerCbQuery(ctx.update.callback_query.id, 'Используй последнее сообщение от бота', {show_alert: true})
                console.log('old message')
            } 
            ctx.answerCbQuery()

        })
    }
    catch(error){
        console.log(error)
    }
}
