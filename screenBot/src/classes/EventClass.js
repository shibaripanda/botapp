
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
        return keyboardsYears
    }
    async getKeyboardEventMounth(year){

        const mounths = [...new Set(await this.days.filter(item => (new Date(item.day)).getFullYear() === Number(year)).map(item => (new Date(item.day)).getMonth()))]
        const keyboardsMounths = []
        for(const i of mounths){
            const days = await this.days.filter(item => (new Date(item.day)).getFullYear() === Number(year) && (new Date(item.day)).getMonth() === i).map(item => item.slots).flat().filter(item => item.openForRegistration)
            if(days.length){
                keyboardsMounths.push([{text: i + ` (${year})`, to: `${this.sceenId}|to_days|${year}|${i}`, action: 'callback'}])
            }
            else{
                keyboardsMounths.push([{text: i + ` (${year}) ` + '🔒', to: `zero`, action: 'callback'}])
            }
        }
        return [[{text: 'back', to: this.sceenId, action: 'callback'}]].concat(keyboardsMounths)
    }
    async getKeyboardEventDays(year, mounth){

        const dayList = await this.days.filter(item => (new Date(item.day)).getFullYear() === Number(year) && (new Date(item.day)).getMonth() === Number(mounth))
        const keyboardDays = []
        for(const i of dayList){
            const days = await i.slots.filter(item => item.openForRegistration)
            if(days.length){
                keyboardDays.push([{text: new Date(i.day).getDate() + ` (${mounth}, ${year})`, to: `${this.sceenId}|to_slots|${year}|${mounth}|${new Date(i.day).getDate()}`, action: 'callback'}])
            }
            else{
                keyboardDays.push([{text: i + ` (${mounth}, ${year}) ` + '🔒', to: `zero`, action: 'callback'}])
            }
        }
        return [[{text: 'back', to: this.sceenId, action: 'callback'}]].concat(keyboardDays)
    }
    async getKeyboardEventSlots(year, mounth, day){

        const slots = (await this.days.filter(item => (new Date(item.day)).getFullYear() === Number(year) && (new Date(item.day)).getMonth() === Number(mounth) && (new Date(item.day)).getDate() === Number(day)))[0].slots
        const keyboardSlots = []
        for(const i of slots){
            if(i.openForRegistration){
                keyboardSlots.push([{text: i.startTime + ` (${day}, ${mounth}, ${year})`, to: `${this.sceenId}|prereg|${year}|${mounth}|${day}|${i.startTime}`, action: 'callback'}])
            }
            else{
                keyboardSlots.push([{text: i.startTime + ` (${day}, ${mounth}, ${year}) ` + '🔒', to: `zero`, action: 'callback'}])
            }
        }
        return [[{text: 'back', to: this.sceenId, action: 'callback'}]].concat(keyboardSlots)
    }

    async getKeyboardEventPreReg(year, mounth, day, slotTime){

        const slots = (await this.days.filter(item => (new Date(item.day)).getFullYear() === Number(year) && (new Date(item.day)).getMonth() === Number(mounth) && (new Date(item.day)).getDate() === Number(day)))[0]
        const keyboardSlots = []

        const a = slots.slots.findIndex(item => item.startTime === slotTime)
        const b = slots.day

        console.log(this.event.days[0].slots)

        const x = await this.event.updateOne(
            {_id: this._id},
            { $addToSet: { 'days.$[xl].slots.$[el].clients': 4545454545 } },
            {
               arrayFilters: [{ 'el.startTime': slotTime,  'xl.day': b }],
               new: true
            }
         )

         console.log(x)

        return [[{text: 'back', to: this.sceenId, action: 'callback'}]].concat(keyboardSlots)
    }
    

}