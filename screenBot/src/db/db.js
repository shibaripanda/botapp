import { mongoose } from "mongoose"
export const db = async () => {
    let status = false
    await mongoose.connect(process.env.MONGO_TOKEN)
    .then((res) => {
        console.log(`# connect to DB`)
        status = true
    })
    .catch(async (error) => {
        console.log('connecting...')
        console.log(error)
    })
    return status
}