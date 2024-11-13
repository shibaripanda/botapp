import mongoose from 'mongoose'

const Schema = mongoose.Schema

const screenSchema = new Schema({
    owner: {type: String},
    name: {type: String},
    index: {type: String},
    variable: {type: String},
    ansScreen: {type: String},
    media: {
        type: Array,
        required: true,
        default: []
    },
    document: {
        type: Array,
        required: true,
        default: []
    },
    audio: {
        type: Array,
        required: true,
        default: []
    },
    text: {
        type: String,
        required: false,
    },
    buttons: {
        type: Array,
        required: true,
        default: []
    },
    protect: {
        type: Boolean,
        required: true,
        default: true
    },
    // status: {
    //     type: Boolean,
    //     required: true,
    //     default: true
    // }
}, { timestamps: true});


export const Screen = mongoose.model('Screen', screenSchema)
