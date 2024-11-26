import * as mongoose from 'mongoose';

export const EventSchema = new mongoose.Schema({
    idEvent: {type: String},
    name: {type: String},
    status: {type: String},
    days: {type: Array}
}, {timestamps: true})

export interface Event {
    idEvent: string,
    name: string,
    status: string,
    days: []
}
