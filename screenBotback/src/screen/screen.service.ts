import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { BotService } from 'src/bot/bot.service';
import { EventService } from 'src/event/event.service';

interface EventItem {
    idEvent: string,
    name: string,
    status: string
    dateStartPeriod: [],
    daysForDelete: [],
    checked: [],
    referensDay: any,
    currentEditDays: [],
    daysArrow: [],
    checkedEdit: [],
    checkedAll: boolean,
    days: []
  }

@Injectable()
export class ScreenService {

    constructor(
        @InjectModel('Screen') 
            private screenMongo: Model<Screen>,
            @Inject(forwardRef(() => BotService))
            private botService: BotService,
            @Inject(forwardRef(() => EventService))
            private eventService: EventService
    ){}

        async createZeroScreen(_id: string){
            await this.screenMongo.create({
                owner: _id, 
                name: 'Start screen',
                text: 'Hello, bot service is activated!',
                media: [],
                document: [],
                audio: [],
                buttons: [],
                protect: true
            })
            await this.screenMongo.create({
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
            await this.screenMongo.create({
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

        async createEventScreen(userId: number, botId: string, screenName: string, idEvent: string){
            
            const events: EventItem[] = await this.botService.getEvents(userId, botId)
            if(events.length){
               const event: EventItem = events.find(item => item.idEvent === idEvent)

               const newEvent = await this.eventService.createEvent({
                                                                    name: event.name, 
                                                                    owner: botId, 
                                                                    idEvent: event.idEvent, 
                                                                    days: event.days, 
                                                                    dateStartAndStop: event.dateStartPeriod
                                                                })

               console.log(newEvent)
               
                await this.screenMongo.create({
                owner: botId, 
                name: screenName,
                text: '',
                media: [],
                document: [],
                audio: [],
                buttons: [],
                protect: true,
                variable: '',
                mode: 'event',
                event_id: newEvent._id
            })
            }
        }

        async copyScreen(botId: string, screenId: string){
            const screen = await this.screenMongo.findOne({owner: botId, _id: screenId})
            await this.screenMongo.create({
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
            await this.screenMongo.deleteOne({_id: id})
        }

        async getScreens(owner: string){
            const screens = await this.screenMongo.find({owner: owner})
            return screens
        }

        async clearScreen(owner: string, _id: string){
            await this.screenMongo.updateOne({owner: owner, _id: _id}, {text: '', media: [], document: [], audio: [], buttons: []})
        }

        async addContentItem(owner: string, _id: string, content: string){
            console.log('ddd')
            console.log(content['type'])
            if(content['type'] === 'text'){
                await this.screenMongo.updateOne({owner: owner, _id: _id}, {text: content['media']})
            }
            else if(['photo', 'video'].includes(content['type'])){
                await this.screenMongo.updateOne({owner: owner, _id: _id}, {$addToSet: {media: content}}) 
                const res = await this.screenMongo.findOne({owner: owner, _id: _id}, {media: 1})
                if(res['media'].length > 9){
                    res['media'].splice(0, 1)
                    await this.screenMongo.updateOne({owner: owner, _id: _id}, {media: res['media']})
                }
            }
            else{
                await this.screenMongo.updateOne({owner: owner, _id: _id}, {$addToSet: {[content['type']]: content}})
                const res = await this.screenMongo.findOne({owner: owner, _id: _id}, {[content['type']]: 1})
                if(res[content['type']].length > 9){
                    res[content['type']].splice(0, 1)
                    await this.screenMongo.updateOne({owner: owner, _id: _id}, {[content['type']]: res[content['type']]})
                }
            }
        }

        async deleteContentItem(owner: string, _id: string, content: string, index: number){
            await this.screenMongo.updateOne({owner: owner, _id: _id}, {$pull: {[content]: index}})
        }

        async editScreenName(owner: string, _id: string, name: string){
            await this.screenMongo.updateOne({owner: owner, _id: _id}, {name: name})
        }

        async editButtons(owner: string, _id: string, buttons: []){
            await this.screenMongo.updateOne({owner: owner, _id: _id}, {buttons: buttons})
        }

        async updateVariable(owner: string, _id: string, variable: string){
            await this.screenMongo.updateOne({owner: owner, _id: _id}, {variable: variable})
        }

        async screenForAnswer(owner: string, _id: string, ansScreen: string){
            await this.screenMongo.updateOne({owner: owner, _id: _id}, {ansScreen: ansScreen})
        }

        async protectScrreen(owner: string, _id: string, status: boolean){
            await this.screenMongo.updateOne({owner: owner, _id: _id}, {protect: status})
        }
}
