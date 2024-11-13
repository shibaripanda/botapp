import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const BotSchema = new Schema({
  owner: {type: Number},
  token: {type: String},
  status: {type: Boolean},
  name: {type: String},
  username: {type: String},
  mode: {type: String},
  content: {type: Array}
  }, {timestamps: true})

export const Bot = mongoose.model('Bot', BotSchema)
