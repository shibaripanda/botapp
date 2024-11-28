import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const MyEventSchema = new Schema({
  idEvent: {type: String},
  name: {type: String},
  dateStartAndStop: {type: Array},
  days: {type: Array},
  owner: {type: String}
  }, {timestamps: true})

export const MyEvent = mongoose.model('Event', MyEventSchema)
