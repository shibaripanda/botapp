import { getUser } from "../modules/getUser.js"

export const botCallback = async (botModule) => {
    try{
        botModule.bot.on('callback_query', async (ctx) => {
            // console.log(ctx.update.update_id)

            const screen = await botModule.getScreen(ctx.update.callback_query.data.split('|')[0])
            console.log(screen)
            console.log(ctx.update.callback_query.data.split('|')[0]) 
            if(screen){
                const user = await getUser(ctx.from, botModule._id)
                await botModule.message(screen, ctx.update.callback_query.from.id, user.data, ctx.update.callback_query.data.split('|'))
                await user.updateScreen(ctx.update.callback_query.data)
                await user.updateToClient()
            }
            else{
               await botModule.errorMessage(ctx.update.callback_query.from.id) 
            } 
            ctx.answerCbQuery()

        })
    }
    catch(error){
        console.log(error)
    }
}
