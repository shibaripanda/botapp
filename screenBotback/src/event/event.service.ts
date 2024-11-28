import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateEventDto } from './dto/create-event.dto'

@Injectable()
export class EventService {

    constructor(
        @InjectModel('Event') 
            private eventMongo: Model<Event>
        ) {}

        async createEvent(data: CreateEventDto){
            return await this.eventMongo.create({
                owner: data.owner,
                idEvent: data.idEvent,
                name: data.name,
                dateStartAndStop: data.dateStartAndStop,
                days: data.days
            })
        }
}
