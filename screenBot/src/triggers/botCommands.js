
export const botCommands = async (bot, botA) => {
    try{
        bot.command(['delall'], async (ctx) => {
            if(ctx.message.chat.id > 0 && !ctx.from.is_bot){
                if(ctx.command === 'delall' ){
                    console.log('dddddddddddddddddddddddd')
                }
                else if(ctx.command){
                    console.log('sdsdsdsdsdsdsdsdsdsd')
                }
            }
        })
    }
    catch(error){
        console.log(error)
    }
}
