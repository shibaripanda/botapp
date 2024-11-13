import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'

@Injectable()
export class ScreenService {

    constructor(
        @InjectModel('Screen') private botMongo: Model<Screen>) {}

        async createZeroScreen(_id: string){
            await this.botMongo.create({
                owner: _id, 
                name: 'Start screen',
                text: 'Hello, bot service is activated!',
                media: [],
                document: [],
                audio: [],
                buttons: [],
                protect: true
            })
            await this.botMongo.create({
                owner: _id, 
                name: 'Error screen',
                text: 'Error, oops!',
                media: [],
                document: [],
                audio: [],
                buttons: [],
                protect: true
            })
        }

        async createNewScreen(botId: string, screenName: string){
            await this.botMongo.create({
                owner: botId, 
                name: screenName,
                text: '',
                media: [],
                document: [],
                audio: [],
                buttons: [],
                protect: true,
                variable: ''
            })
        }

        async copyScreen(botId: string, screenId: string){
            const screen = await this.botMongo.findOne({owner: botId, _id: screenId})
            await this.botMongo.create({
                owner: botId, 
                name: screen['name'] + ' (copy) ' + Date.now(),
                text: screen['text'],
                media: screen['media'],
                document: screen['document'],
                audio: screen['audio'],
                buttons: screen['buttons'],
                protect: screen['protect'],
                variable: screen['variable']
            })
        }

        async deleteScreen(id: string){
            await this.botMongo.deleteOne({_id: id})
        }

        async getScreens(owner: string){
            const screens = await this.botMongo.find({owner: owner})
            return screens
        }

        async clearScreen(owner: string, _id: string){
            await this.botMongo.updateOne({owner: owner, _id: _id}, {text: '', media: [], document: [], audio: [], buttons: []})
        }

        async addContentItem(owner: string, _id: string, content: string){
            console.log('ddd')
            console.log(content['type'])
            if(content['type'] === 'text'){
                await this.botMongo.updateOne({owner: owner, _id: _id}, {text: content['media']})
            }
            else if(['photo', 'video'].includes(content['type'])){
                await this.botMongo.updateOne({owner: owner, _id: _id}, {$addToSet: {media: content}}) 
                const res = await this.botMongo.findOne({owner: owner, _id: _id}, {media: 1})
                if(res['media'].length > 9){
                    res['media'].splice(0, 1)
                    await this.botMongo.updateOne({owner: owner, _id: _id}, {media: res['media']})
                }
            }
            else{
                await this.botMongo.updateOne({owner: owner, _id: _id}, {$addToSet: {[content['type']]: content}})
                const res = await this.botMongo.findOne({owner: owner, _id: _id}, {[content['type']]: 1})
                if(res[content['type']].length > 9){
                    res[content['type']].splice(0, 1)
                    await this.botMongo.updateOne({owner: owner, _id: _id}, {[content['type']]: res[content['type']]})
                }
            }
        }

        async deleteContentItem(owner: string, _id: string, content: string, index: number){
            await this.botMongo.updateOne({owner: owner, _id: _id}, {$pull: {[content]: index}})
        }

        async editScreenName(owner: string, _id: string, name: string){
            await this.botMongo.updateOne({owner: owner, _id: _id}, {name: name})
        }

        async editButtons(owner: string, _id: string, buttons: []){
            await this.botMongo.updateOne({owner: owner, _id: _id}, {buttons: buttons})
        }

        async updateVariable(owner: string, _id: string, variable: string){
            await this.botMongo.updateOne({owner: owner, _id: _id}, {variable: variable})
        }

        async screenForAnswer(owner: string, _id: string, ansScreen: string){
            await this.botMongo.updateOne({owner: owner, _id: _id}, {ansScreen: ansScreen})
        }

        async protectScrreen(owner: string, _id: string, status: boolean){
            await this.botMongo.updateOne({owner: owner, _id: _id}, {protect: status})
        }
}
