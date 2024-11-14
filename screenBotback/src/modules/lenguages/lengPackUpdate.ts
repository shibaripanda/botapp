import 'dotenv/config'
import { openAiRequest } from './openAI'

interface LengData {
    rutext: string
    index: string
    info_data: string
}
interface LengDataStart {
    title: string
    index: string
    info: string
}
interface LengResult {
    [key: string]: string
}
interface NewLengPack {
    [key: string]: LengResult
}

export const getLenguagesFromAI = async (updateAll: boolean, indata: LengData[], lenguages: LengDataStart[], existLengPack: NewLengPack) => {
    function dublicateIndexControl(){
        return new Set(indata.map(item => item.index)).size !== indata.map(item => item.index).length
    }

    if(dublicateIndexControl()){
        console.log('Дубликаты текстовых индексов')
        return existLengPack
    }

    const newLengPack: NewLengPack = {}
    let time: number = 0
    const timer = setInterval(() => {console.log('UPDATING LENGUAGES...'), time++}, 1000)
    for(const i of indata){
        if(typeof existLengPack[i.index] === 'undefined' || updateAll){
            console.log('new', i.index)
            const newRes: LengResult = {info_data: i.info_data, ru: i.rutext}
            for(const l of lenguages.filter(item => item.index !== 'ru')){
                newRes[l.index] = await openAiRequest(`Переведи на ${l.info} язык: "${i.rutext}", без кавычек и с большой буквы, в ответе только перевод`)
            }
            newLengPack[i.index] = newRes
        }
        else{
            console.log('exist', i.index)
            newLengPack[i.index] = existLengPack[i.index] 
        }
    }
    clearInterval(timer)
    console.log(time, 'seconds')
    return newLengPack
}
