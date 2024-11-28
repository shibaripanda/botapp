import * as mongoose from 'mongoose';

export const EventSchema = new mongoose.Schema({
    idEvent: {type: String},
    name: {type: String},
    dateStartAndStop: {type: Array},
    days: {type: Array},
    owner: {type: String}
}, {timestamps: true})

export interface Event {
    idEvent: string,
    name: string,
    status: string,
    days: []
}


