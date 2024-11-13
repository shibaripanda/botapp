import { getUser } from "../modules/getUser.js"

export const botMessage = async (botModule) => {
    try{
        botModule.bot.on('message', async (ctx) => {
            await botModule.updateBotData()
            if(ctx.message.chat.id > 0 && !ctx.from.is_bot){
                if(botModule.owner == ctx.message.chat.id && botModule.mode !== ''){
                    await botModule.addInfoForScreen(ctx)
                }
                else{
                    const user = await getUser(ctx.from, botModule._id)
                    if(await user.getCurrentVariable() && typeof ctx.message['text'] !== 'undefined') await user.updateData(ctx.message.text)
                    const ans = await user.getScreenForAns()
                    if(ans.status){
                        console.log(ans.status)
                        const screen = await botModule.getScreen(ans.status)
                        if(screen){
                            await botModule.message(screen, user.id, user.data)
                            await user.updateScreen(screen._id.toString())
                        }
                        else{
                            await botModule.errorMessage(user.id)
                        }
                        
                    }
                    await user.updateToClient()
                }

            }
        })
    }
    catch(error){
        console.log(error)
    }
}
