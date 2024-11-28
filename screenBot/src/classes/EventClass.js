
export class EventClass {

    constructor(event, botId) {
        this.owner = event.owner
        this.name = event.name,
        this.idEvent = event.idEvent,
        this.days = event.days,
        this.dateStartAndStop = event.dateStartAndStop
        this.botId = botId
        this._id = event._id
    }


    async getKeyboardEventYears(){

        const years = [...new Set(await this.days.map(item => (new Date(item.day)).getFullYear()))]
        const keyboardsYears = []
        for(const i of years){
            const days = await this.days.filter(item => (new Date(item.day)).getFullYear() === i).map(item => item.slots).flat().filter(item => item.openForRegistration)
            console.log(days.length)
            if(days.length){
                keyboardsYears.push([{text: i, to: `${this._id}|to_mounth|${i}`, action: 'event'}])
            }
            else{
                keyboardsYears.push([{text: i + '🔒', to: `zero`, action: 'event'}])
            }
        }
        return keyboardsYears
    }

    async getKeyboardEventMounth(){

        const years = [...new Set(await this.days.map(item => (new Date(item.day)).getFullYear()))]
        const keyboardsYears = []
        for(const i of years){
            const days = await this.days.filter(item => (new Date(item.day)).getFullYear() === i).map(item => item.slots).flat().filter(item => item.openForRegistration)
            console.log(days.length)
            if(days.length){
                keyboardsYears.push([{text: i, to: `${this._id}|to_mounth|${i}`, action: 'event'}])
            }
            else{
                keyboardsYears.push([{text: i + '🔒', to: `zero`, action: 'event'}])
            }
        }
        console.log(keyboardsYears)

        const y = 2024
        const mounths = await this.days.filter(item => (new Date(item.day)).getFullYear() === y).map(item => (new Date(item.day)).getMonth())
        // console.log([...new Set(mounths)].map(item => ([{text: item, to: `${this._id}|to_day|${item}`, action: 'callback'}])))
        
        const m = 11
        const days = await this.days.filter(item => (new Date(item.day)).getFullYear() === y && (new Date(item.day)).getMonth() === m).map(item => (new Date(item.day)).getDay())
        // console.log(days.map(item => ([{text: item, to: `${this._id}|to_slot|${item}`, action: 'callback'}])))

    }

}