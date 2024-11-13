import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './user.model'

@Injectable()
export class UsersService {

    constructor(
        @InjectModel('User') private userMongo: Model<User>) {}

    async createUser(id: number){
        const user = await this.userMongo.create({id: id})
        // console.log('User createUser: ' + user)
        return user
    }

    async getUser(id: number){
        const user = await this.userMongo.findOne({id: id}, {activBot: 0})
        // console.log('User getUser: ' + user)
        return user
    }

    async getUsers(botId: string){
        console.log('User getUsers')
        const link = `activBot.${botId}`
        const users = await this.userMongo.find({$or : [{[link]: true}, {[link]: false}]}, {id: 1, activBot: 1, data: 1, username: 1, screen: 1})
        // console.log(users)
        // console.log('User getUsers: ', users.map(item => ({_id: item._id.toString(), data: item.data[botId], activBot: item.activBot[botId]})))
        if(users.length){
            return users.map(item => ({
                id: item.id, 
                username: item.username, 
                _id: item._id.toString(), 
                data: item.data[botId] ? item.data[botId] : {}, 
                activBot: item.activBot[botId] ? item.activBot[botId] : false,
                screen: item.screen[botId] ? item.screen[botId] : ''
            }))
        }
        else{
            return []
        }
    }

}
