import { getUser } from "../modules/getUser.js"

export const botChatMember = async (botModule) => {
    try{
        botModule.bot.on('my_chat_member', async (ctx) => {
            if(!ctx.from.is_bot){
               const user = await getUser(ctx.from, botModule._id)
               await user.updateStatusInBot(ctx.update.my_chat_member.new_chat_member.status)
               await user.updateToClient() 
            }
        })
    }
    catch(error){
        console.log(error)
    }
}
