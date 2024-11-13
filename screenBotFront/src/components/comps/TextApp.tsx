import { Text } from "@mantine/core"
import React from "react"

export const TextApp = ({title, text}) => {

    if(title){
        return (
            <Text fw={700} fz="md">{title} {text}</Text>
        )
    }

    return (
        <Text fw={700} fz="md">{text}</Text>
    )

}