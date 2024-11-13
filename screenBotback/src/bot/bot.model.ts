import * as mongoose from 'mongoose';

export const BotSchema = new mongoose.Schema({
  // botId: {type: Number},
  owner: {type: Number},
  token: {type: String},
  status: {type: Boolean},
  name: {type: String},
  username: {type: String},
  mode: {type: String},
  content: {type: Array},
  groups: {type: Array},
  events: {type: Array}
}, {timestamps: true})

export interface Bot {
  //  id: number,
  _id: string,
  owner: string,
  token: string,
  status: boolean,
  name: string,
  username: string,
  mode: string,
  content: [],
  groups: [],
  events: []
}
