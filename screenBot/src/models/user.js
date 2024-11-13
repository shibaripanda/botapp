import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
id: {
    type: Number,
    required: true,
},
data: {
    type: Object,
    required: true,
},
activBot: {
    type: Object,
    required: false
},
screen: {
    type: Object,
    required: false,
},
username: {
    type: String,
    required: false,
},
language: {
    type: String,
    required: false,
},
first_name: {
    type: String,
    required: false,
}
}, { timestamps: true});


export const User = mongoose.model('User', userSchema)
