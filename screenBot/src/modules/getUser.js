import { UserClass } from "../classes/UserClass.js"
import { Screen } from "../models/screen.js"
import { User } from "../models/user.js"

export const getUser = async (userData, botId) => {

    let user = await User.findOneAndUpdate({id: userData.id}, {username: userData.username, language: userData.language, first_name: userData.first_name}, {returnDocument: "after", upsert: true})

    if(typeof user['activBot'] == 'undefined' || typeof user['data'] == 'undefined' || typeof user['screen'] == 'undefined'){
        const link = `activBot.${botId}`
        const data = `data.${botId}`
        const screen = `screen.${botId}`
        const startScreen = await Screen.findOne({owner: botId, name: 'Start screen'})
        user = await User.findOneAndUpdate({id: userData.id}, {[link]: true, [data]: {startTime: Date.now()}, [screen]: startScreen._id.toString()}, {returnDocument: "after"})
    }
    else if(typeof user.activBot[botId] == 'undefined' || typeof user.data[botId] == 'undefined' || typeof user.screen[botId] == 'undefined'){
        const link = `activBot.${botId}`
        const data = `data.${botId}`
        const screen = `screen.${botId}`
        const startScreen = await Screen.findOne({owner: botId, name: 'Start screen'})
        user = await User.findOneAndUpdate({id: userData.id}, {[link]: true, [data]: {startTime: Date.now()}, [screen]: startScreen._id.toString()}, {returnDocument: "after"})
    }

    return new UserClass(user, botId)
    
}