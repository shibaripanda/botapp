import { Markup } from "telegraf"
import { Screen } from "../models/screen.js"
import { AppClass } from "./AppClass.js"
import { SocketApt } from "../socket/api/socket-api.js"

export class BotClass {

    constructor(bot, data) {
        this.mongoBot = data
        this.bot = bot
        this.owner = data.owner
        this.name = data.name
        this.username = data.username
        this._id = data._id.toString()
        this.status = data.status
        this.mode = data.mode
    }

    async updateBotData(){
        const app = new AppClass()
        this.mode = (await app.getBot(this._id)).mode
    }

    async message(screen, userId, userData){
        if(userData){
            for(const key in userData){
                screen.text = screen.text.replaceAll(`<$>${key}<$>`, userData[key])
            }
            for(const key in userData){
                screen.text = screen.text.replaceAll(`<$>${key}<$>`, '')
            }
        }

        const keyboard = () => {
            if(screen.buttons.length){
               const res = []
                for(const i of screen.buttons){
                    res.push(i.map(item => Markup.button[item.action](item.text, item.to)))
                }
                return Markup.inlineKeyboard(res) 
            }
        }

        const emptyText = () => {
            if(screen.text == '') return '------------------------------'
            return screen.text
        }

        if(!screen.media.length && !screen.document.length && !screen.audio.length && screen.text == ''){
            await this.bot.telegram.sendMessage(userId, `Empty screen.\nAdd content: videos, photos, voice, audio, files or text`, {protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))
        }
        else{
            if(screen.text && screen.text.length > 1000){
                if(screen.document.length){
                    await this.bot.telegram.sendMediaGroup(userId, screen.document, {protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))
                }
                if(screen.audio.length){
                    for(let mes of screen.audio){
                        await this.bot.telegram.sendAudio(userId, mes.media, {protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))
                    }
                }
                if(screen.media.length){
                    await this.bot.telegram.sendMediaGroup(userId, screen.media, {protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))
                }
                await this.bot.telegram.sendMessage(userId, emptyText(), {...keyboard(), protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))
            }
            else{
                if(screen.media.length && !screen.document.length && !screen.audio.length){
                    if(screen.media.length == 1 && screen.media[0].type == 'photo'){
                        await this.bot.telegram.sendPhoto(userId, screen.media[0].media, {...keyboard(), caption: screen.text, protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))  
                    }
                    else if(screen.media.length == 1 && screen.media[0].type == 'video'){
                        await this.bot.telegram.sendVideo(userId, screen.media[0].media, {...keyboard(), caption: screen.text, protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))  
                    }
                    else{
                    if(!screen.buttons.length){
                            screen.media[0].caption = screen.text
                            await this.bot.telegram.sendMediaGroup(userId, screen.media, {protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))  
                        }
                        else{
                            await this.bot.telegram.sendMediaGroup(userId, screen.media, {protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))
                            await this.bot.telegram.sendMessage(userId, emptyText(), {...keyboard(), protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error)) 
                        } 
                    }
                }
                else if(!screen.media.length && screen.document.length && !screen.audio.length){
                    if(screen.document.length == 1){
                        await this.bot.telegram.sendDocument(userId, screen.document[0].media, {...keyboard(), caption: screen.text, protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error)) 
                    }
                    else{
                        if(!screen.buttons.length){
                            screen.document[screen.document.length - 1].caption = screen.text
                            await this.bot.telegram.sendMediaGroup(userId, screen.document, {protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))
                        }
                        else{
                            await this.bot.telegram.sendMediaGroup(userId, screen.document, {protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))
                            await this.bot.telegram.sendMessage(userId, emptyText(), {...keyboard(), protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))
                        } 
                    } 
                }
                else if(!screen.media.length && !screen.document.length && screen.audio.length){
                    for(let mes of screen.audio){
                        if(screen.audio.indexOf(mes) == screen.audio.length - 1){
                            await this.bot.telegram.sendAudio(userId, mes.media, {...keyboard(), caption: screen.text, protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error)) 
                        }
                        else{
                            await this.bot.telegram.sendAudio(userId, mes.media, {protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error)) 
                        }
                    } 
                }
                else{
                    if(screen.document.length){
                        await this.bot.telegram.sendMediaGroup(userId, screen.document, {protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))
                    }
                    if(screen.audio.length){
                        for(let mes of screen.audio){
                            await this.bot.telegram.sendAudio(userId, mes.media, {protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))
                        }
                    }
                    if(screen.media.length){
                        if(screen.media.length == 1 && screen.media[0].type == 'photo'){
                            await this.bot.telegram.sendPhoto(userId, screen.media[0].media, {...keyboard(), caption: screen.text, protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))  
                        }
                        else if(screen.media.length == 1 && screen.media[0].type == 'video'){
                            await this.bot.telegram.sendVideo(userId, screen.media[0].media, {...keyboard(), caption: screen.text, protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))  
                        }
                        else{
                        if(!screen.buttons.length){
                                screen.media[0].caption = screen.text
                                await this.bot.telegram.sendMediaGroup(userId, screen.media, {protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))  
                            }
                            else{
                                await this.bot.telegram.sendMediaGroup(userId, screen.media, {protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))
                                await this.bot.telegram.sendMessage(userId, emptyText(), {...keyboard(), protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error)) 
                            } 
                        }
                    }
                    else{
                        if(screen.buttons.length || screen.text){
                            await this.bot.telegram.sendMessage(userId, emptyText(), {...keyboard(), protect_content: screen.protect, parse_mode: 'HTML'}).catch(error => console.log(error))
                        }
                    }
                }
            }
           
        }
    }

    async messageContent(userId, content){
        if(content.type === 'text'){
            await this.bot.telegram.sendMessage(userId, content.media, {parse_mode: 'HTML'}).catch(error => console.log(error))
        }
        else{
            await this.bot.telegram.sendMediaGroup(userId, [content], {parse_mode: 'HTML'}).catch(error => console.log(error))
        }
    }

    async errorMessage(userId){
        await this.bot.telegram.sendMessage(userId, 'error', {parse_mode: 'HTML', protect_content: false}).catch(error => console.log(error))
    }

    async getZeroScreen(){
        const screen = await Screen.findOne({owner: this._id, name: 'Start screen'})
        return screen
    }

    async getScreen(screenId){
        const res = await Screen.findOne({owner: this._id, _id: screenId})
        return res
    }

    async createScreen(field, data, caption){
        if(this.mode === 'addContent'){
            if(field === 'TEXT'){
                await this.mongoBot.updateOne({$addToSet: {content: {type: 'text', media: data, tx: data.substring(0, 25) + '...'}}})
            }
            else if(field === 'PHOTO'){
                const url = await this.bot.telegram.getFileLink(data)
                const buffer = await (await fetch(url.href)).arrayBuffer()
                await this.mongoBot.updateOne({$addToSet: {content: {type: 'photo', media: data, tx: caption ? caption : '', buffer: Buffer.from(buffer).toString('base64')}}})
            }
            else if(field === 'VIDEO'){
                await this.mongoBot.updateOne({$addToSet: {content: {type: 'video', media: data, tx: caption ? caption : ''}}})
            }
            else if(field === 'VOICE'){
                await this.mongoBot.updateOne({$addToSet: {content: {type: 'audio', media: data, tx: caption ? caption : ''}}})
            }
            else if(field === 'DOCUMENT'){
                await this.mongoBot.updateOne({$addToSet: {content: {type: 'document', media: data, tx: caption ? caption : ''}}})
            }
            SocketApt.socket.emit('updateContentInfo', {botId: this._id, token: process.env.SERVER_TOKEN})
        }
        else{
            if(field === 'TEXT'){
                await Screen.updateOne({owner: this._id, _id: this.mode}, {text: data})
                await this.mongoBot.updateOne({$addToSet: {content: {type: 'text', media: data, tx: data.substring(0, 25) + '...'}}})
            }
            else if(field === 'PHOTO'){
                const res = await Screen.findOne({owner: this._id, _id: this.mode}, {media: 1, _id: 0})
                if(res.media.length === 10){
                    res.media.splice(0, 1)
                    await Screen.updateOne({owner: this._id, _id: this.mode}, {media: res.media})
                }
                const url = await this.bot.telegram.getFileLink(data)
                const buffer = await (await fetch(url.href)).arrayBuffer()
                await Screen.updateOne({owner: this._id, _id: this.mode}, {$addToSet: {media: {type: 'photo', media: data, tx: caption ? caption : '', buffer: Buffer.from(buffer).toString('base64')}}})
                await this.mongoBot.updateOne({$addToSet: {content: {type: 'photo', media: data, tx: caption ? caption : '', buffer: Buffer.from(buffer).toString('base64')}}})
            }
            else if(field === 'VIDEO'){
                const res = await Screen.findOne({owner: this._id, _id: this.mode}, {media: 1, _id: 0})
                if(res.media.length === 10){
                    res.media.splice(0, 1)
                    await Screen.updateOne({owner: this._id, _id: this.mode}, {media: res.media})
                }
                await Screen.updateOne({owner: this._id, _id: this.mode}, {$addToSet: {media: {type: 'video', media: data, tx: caption ? caption : ''}}})
                await this.mongoBot.updateOne({$addToSet: {content: {type: 'video', media: data, tx: caption ? caption : ''}}})
            }
            else if(field === 'VOICE'){
                const res = await Screen.findOne({owner: this._id, _id: this.mode}, {audio: 1, _id: 0})
                if(res.audio.length === 10){
                    res.audio.splice(0, 1)
                    await Screen.updateOne({owner: this._id, _id: this.mode}, {audio: res.audio})
                }
                await Screen.updateOne({owner: this._id, _id: this.mode}, {$addToSet: {audio: {type: 'audio', media: data, tx: caption ? caption : ''}}})
                await this.mongoBot.updateOne({$addToSet: {content: {type: 'audio', media: data, tx: caption ? caption : ''}}})
            }
            else if(field === 'DOCUMENT'){
                const res = await Screen.findOne({owner: this._id, _id: this.mode}, {document: 1, _id: 0})
                if(res.document.length === 10){
                    res.document.splice(0, 1)
                    await Screen.updateOne({owner: this._id, _id: this.mode}, {document: res.document})
                }
                await Screen.updateOne({owner: this._id, _id: this.mode}, {$addToSet: {document: {type: 'document', media: data, tx: caption ? caption : ''}}})
                await this.mongoBot.updateOne({$addToSet: {content: {type: 'document', media: data, tx: caption ? caption : ''}}})
            }
            SocketApt.socket.emit('updateScreenInfo', {botId: this._id, token: process.env.SERVER_TOKEN})
        }
    }

    async addInfoForScreen(ctx){
        if(typeof ctx.message['text'] !== 'undefined'){
            console.log('TEXT')
            await this.createScreen('TEXT', ctx.message.text)
        }
        if(typeof ctx.message['caption'] !== 'undefined'){
            console.log('CAPTION')
            await this.createScreen('CAPTION', ctx.message.caption)
        }
        if(typeof ctx.message['photo'] !== 'undefined'){
            console.log('PHOTO')
            await this.createScreen('PHOTO', ctx.message.photo[0].file_id, ctx.message.caption)
        }
        if(typeof ctx.message['video'] !== 'undefined'){
            console.log('VIDEO')
            const name = ctx.message.caption ? ctx.message.caption : '' 
            await this.createScreen('VIDEO', ctx.message.video.file_id,  name + ' ' + ctx.message.video.file_name)
        }
        if(typeof ctx.message['audio'] !== 'undefined'){
            console.log('AUDIO')
            const name = ctx.message.caption ? ctx.message.caption : ''
            await this.createScreen('VOICE', ctx.message.audio.file_id, name + ' ' + ctx.message.audio.file_name)
        }
        if(typeof ctx.message['voice'] !== 'undefined'){
            console.log('VOICE')
            await this.createScreen('VOICE', ctx.message.voice.file_id, ctx.message.caption)
        }
        if(typeof ctx.message['document'] !== 'undefined'){
            console.log('DOCUMENT')
            const name = ctx.message.caption ? ctx.message.caption : '' 
            await this.createScreen('DOCUMENT', ctx.message.document.file_id, name + '  ' + ctx.message.document.file_name)
        }
    }
}
