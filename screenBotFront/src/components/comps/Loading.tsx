import React from "react"
import { useState } from "react"

export const Loading = () => {

    const [time, setTime] = useState('')

    setInterval(() => {setTime(time + '.')}, 250)
    
    return (

        <div>Loading{time}</div>

    )
}