// const fs = require('fs')
import fs from 'fs'

export const readTextFile = (file) => {
    fs.readFile(file, 'utf8', (err, data) => {
    if (err) throw err
    console.log('hhh ', data)
    return data
    })
}

