import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class EventService {

    constructor(
        @InjectModel('Event') 
            private eventMongo: Model<Event>
        ) {}

        async createEvent(botId: string, screenName: string, idEvent: string){
            await this.eventMongo.create({
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
                event: idEvent
            })
        }
}
