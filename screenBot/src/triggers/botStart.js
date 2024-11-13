import { getUser } from "../modules/getUser.js"

export const botStart = async (botModule) => {
    try{
        botModule.bot.start(async (ctx) => {
            if(ctx.message.chat.id > 0 && !ctx.from.is_bot){
               const user = await getUser(ctx.message.from, botModule._id)
               const screen = await botModule.getZeroScreen()
               await botModule.message(screen, ctx.message.chat.id)
               await user.updateScreen(screen._id.toString())
               await user.updateToClient()
            }
        })
    }
    catch(error){
        console.log(error)
    }
}


