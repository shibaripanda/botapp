import { MyEvent } from "../models/event.js"

export class EventClass {

    constructor(event, sceenId) {
        this.event = event
        this.owner = event.owner
        this.name = event.name,
        this.idEvent = event.idEvent,
        this.days = event.days,
        this.dateStartAndStop = event.dateStartAndStop
        this.sceenId = sceenId
        this._id = event._id
    }

    async getKeyboardEventYears(){

        const years = [...new Set(await this.days.map(item => (new Date(item.day)).getFullYear()))]
        const keyboardsYears = []
        for(const i of years){
            const days = await this.days.filter(item => (new Date(item.day)).getFullYear() === i).map(item => item.slots).flat().filter(item => item.openForRegistration)
            if(days.length){
                keyboardsYears.push([{text: i, to: `${this.sceenId}|to_mounth|${i}`, action: 'callback'}])
            }
            else{
                keyboardsYears.push([{text: i + '🔒', to: `zero`, action: 'callback'}])
            }
        }
        return {keyboard: keyboardsYears, text: ''}
    }
    async getKeyboardEventMounth(year){

        const mounths = [...new Set(await this.days.filter(item => (new Date(item.day)).getFullYear() === Number(year)).map(item => (new Date(item.day)).getMonth()))]
        const keyboardsMounths = []
        for(const i of mounths){
            const days = await this.days.filter(item => (new Date(item.day)).getFullYear() === Number(year) && (new Date(item.day)).getMonth() === i).map(item => item.slots).flat().filter(item => item.openForRegistration)
            if(days.length){
                keyboardsMounths.push([{text: Number(i + 1), to: `${this.sceenId}|to_days|${year}|${i}`, action: 'callback'}])
            }
            else{
                keyboardsMounths.push([{text: Number(i + 1) + '🔒', to: `zero`, action: 'callback'}])
            }
        }
        return {keyboard: [[{text: '🔙', to: this.sceenId, action: 'callback'}]].concat(keyboardsMounths), text: year}
    }
    async getKeyboardEventDays(year, mounth){

        const dayList = await this.days.filter(item => (new Date(item.day)).getFullYear() === Number(year) && (new Date(item.day)).getMonth() === Number(mounth))
        const keyboardDays = []
        for(const i of dayList){
            const days = await i.slots.filter(item => item.openForRegistration)
            if(days.length){
                keyboardDays.push([{text: new Date(i.day).getDate(), to: `${this.sceenId}|to_slots|${year}|${mounth}|${new Date(i.day).getDate()}`, action: 'callback'}])
            }
            else{
                keyboardDays.push([{text: new Date(i.day).getDate() + '🔒', to: `zero`, action: 'callback'}])
            }
        }
        return {keyboard: [[{text: '🔙', to: this.sceenId, action: 'callback'}]].concat(keyboardDays), text: (Number(mounth) + 1) + '.' + year}
    }
    async getKeyboardEventSlots(year, mounth, day){

        const slots = (await this.days.filter(item => (new Date(item.day)).getFullYear() === Number(year) && (new Date(item.day)).getMonth() === Number(mounth) && (new Date(item.day)).getDate() === Number(day)))[0].slots
        const keyboardSlots = []
        for(const i of slots){
            if(i.openForRegistration){
                keyboardSlots.push([{text: i.startTime, to: `${this.sceenId}|prereg|${year}|${mounth}|${day}|${i.startTime}`, action: 'callback'}])
            }
            else{
                keyboardSlots.push([{text: i.startTime + '🔒', to: `zero`, action: 'callback'}])
            }
        }
        return {keyboard: [[{text: '🔙', to: this.sceenId, action: 'callback'}]].concat(keyboardSlots), text: day + '.' + (Number(mounth) + 1) + '.' + year}
    }

    async getKeyboardEventPreReg(year, mounth, day, slotTime, userId){

        const slots = (await this.event.days.filter(item => (new Date(item.day)).getFullYear() === Number(year) && (new Date(item.day)).getMonth() === Number(mounth) && (new Date(item.day)).getDate() === Number(day)))[0]

        const a = slots.slots.findIndex(item => item.startTime === slotTime)
        const b = slots.day

        let clients = this.event.days.find(item => item.day === b).slots[a].clients
        let maxClients = this.event.days.find(item => item.day === b).slots[a].maxClients

        for(const i of clients){
            if(i.time + 300000 < Date.now() && i.status === 'prereg'){
                const link = `days.$[el].slots.${a}.clients`
                this.event = await MyEvent.findByIdAndUpdate(
                    {_id: this._id},
                    {$pull: {[link]: i}},
                    {arrayFilters: [{ 'el.day': b }], new: true}, {returnDocument: 'after'}
                )
                const linkReg = `days.$[el].slots.${a}.openForRegistration`
                this.event = await MyEvent.findByIdAndUpdate(
                    {_id: this._id},
                    {$set: {[linkReg]: true}},
                    {arrayFilters: [{ 'el.day': b }], new: true}, {returnDocument: 'after'}
                )  
            }
        }

        clients = this.event.days.find(item => item.day === b).slots[a].clients
        maxClients = this.event.days.find(item => item.day === b).slots[a].maxClients

        if(clients.length === maxClients){
            const linkReg = `days.$[el].slots.${a}.openForRegistration`
            this.event = await MyEvent.findByIdAndUpdate(
                {_id: this._id},
                {$set: {[linkReg]: false}},
                {arrayFilters: [{ 'el.day': b }], new: true}, {returnDocument: 'after'}
            ) 
            return await this.getKeyboardEventSlots(year, mounth, day)
        }
        else{
            const link = `days.$[el].slots.${a}.clients`
            this.event = await MyEvent.findByIdAndUpdate(
                {_id: this._id},
                {$addToSet: {[link]: {user: userId, time: Date.now(), status: 'prereg'}}},
                {arrayFilters: [{ 'el.day': b }], new: true}, {returnDocument: 'after'}
            )
            clients = this.event.days.find(item => item.day === b).slots[a].clients
            maxClients = this.event.days.find(item => item.day === b).slots[a].maxClients
            if(clients.length === maxClients){
                const linkReg = `days.$[el].slots.${a}.openForRegistration`
                this.event = await MyEvent.findByIdAndUpdate(
                    {_id: this._id},
                    {$set: {[linkReg]: false}},
                    {arrayFilters: [{ 'el.day': b }], new: true}, {returnDocument: 'after'}
                )
            }
            return {keyboard: 
                [[{text: '✅', to: `${this.sceenId}|reg|${year}|${mounth}|${day}|${slotTime}`, action: 'callback'}], [{text: '❌', to: this.sceenId, action: 'callback'}]], 
                text: day + '.' + (Number(mounth) + 1) +'.' + year + ' ' + slotTime}
        }

    }
    async regEvent(year, mounth, day, slotTime, userId, userInfo){

        const slots = (await this.event.days.filter(item => (new Date(item.day)).getFullYear() === Number(year) && (new Date(item.day)).getMonth() === Number(mounth) && (new Date(item.day)).getDate() === Number(day)))[0]

        const a = slots.slots.findIndex(item => item.startTime === slotTime)
        const b = slots.day

        let clients = this.event.days.find(item => item.day === b).slots[a].clients
        let maxClients = this.event.days.find(item => item.day === b).slots[a].maxClients

        for(const i of clients){
            if(i.time + 300000 < Date.now() && i.status === 'prereg'){
                const link = `days.$[el].slots.${a}.clients`
                this.event = await MyEvent.findByIdAndUpdate(
                    {_id: this._id},
                    {$pull: {[link]: i}},
                    {arrayFilters: [{ 'el.day': b }], new: true}, {returnDocument: 'after'}
                )
                const linkReg = `days.$[el].slots.${a}.openForRegistration`
                this.event = await MyEvent.findByIdAndUpdate(
                    {_id: this._id},
                    {$set: {[linkReg]: true}},
                    {arrayFilters: [{ 'el.day': b }], new: true}, {returnDocument: 'after'}
                )  
            }
        }

        clients = this.event.days.find(item => item.day === b).slots[a].clients
        maxClients = this.event.days.find(item => item.day === b).slots[a].maxClients

        if(clients.find(item => item.user === userId && item.status === 'prereg')){
            const index = clients.findIndex(item => item.user === userId && item.status === 'prereg')
            const link = `days.$[el].slots.${a}.clients.${index}.status`
            const link2 = `days.$[el].slots.${a}.clients.${index}.userInfo`
            this.event = await MyEvent.findByIdAndUpdate(
                {_id: this._id},
                {$set: {[link]: 'reg'}, [link2]: userInfo},
                {arrayFilters: [{ 'el.day': b }], new: true}, {returnDocument: 'after'}
            )
            // bot.telegram.sendMessage(userId, `Ваша регистрация: ${day}.${mounth}.${year} ${slotTime}`) 
        }
        else{
            if(clients.length === maxClients){
                const linkReg = `days.$[el].slots.${a}.openForRegistration`
                this.event = await MyEvent.findByIdAndUpdate(
                    {_id: this._id},
                    {$set: {[linkReg]: false}},
                    {arrayFilters: [{ 'el.day': b }], new: true}, {returnDocument: 'after'}
                ) 
                console.log('1')
                return await this.getKeyboardEventSlots(year, mounth, day)
            }
            else{
                console.log('2')
                const link = `days.$[el].slots.${a}.clients`
                this.event = await MyEvent.findByIdAndUpdate(
                    {_id: this._id},
                    {$addToSet: {[link]: {user: userId, time: Date.now(), status: 'reg'}}},
                    {arrayFilters: [{ 'el.day': b }], new: true}, {returnDocument: 'after'}
                )
                clients = this.event.days.find(item => item.day === b).slots[a].clients
                maxClients = this.event.days.find(item => item.day === b).slots[a].maxClients
                if(clients.length === maxClients){
                    const linkReg = `days.$[el].slots.${a}.openForRegistration`
                    this.event = await MyEvent.findByIdAndUpdate(
                        {_id: this._id},
                        {$set: {[linkReg]: false}},
                        {arrayFilters: [{ 'el.day': b }], new: true}, {returnDocument: 'after'}
                    )
                }
            }
        }
        return {keyboard: [[{text: '🔙', to: this.sceenId, action: 'callback'}]], text: day + '.' + (Number(mounth) + 1) + '.' + year + ' ' + slotTime + ' ' + '✅'}

    }
    
}