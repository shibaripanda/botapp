import * as mongoose from 'mongoose';

export const AppSchema = new mongoose.Schema({
    text: {type: Object, default: {text: 'text'}},
    mainServerAppSettings: {type: String, default: 'mainServerAppSettings', unique: true},
    restartCount: {type: Number, default: 0}
  }, {timestamps: true})
  
  export interface App {
    text: NewLengPack,
  }
  
  
  interface LengResult {
    [key: string]: string
  }
  export interface NewLengPack {
    [key: string]: LengResult
  }