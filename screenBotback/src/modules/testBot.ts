import { Telegraf } from 'telegraf'

export const testBot = async (token) => {
    try{
        let check: any = false
        
        const bot = new Telegraf(token)

        await bot.telegram.getMe()
        .then((bot) => {
            check = {
                name: bot.first_name,
                username: bot.username
            }
        })
        .catch(() => {
            check = false
        })
        
        return check
    }
    catch(error){
        console.log(error)
    }
}