import { Button } from "@mantine/core"
import React from "react"

export const ButtonApp = (props) => {

    const colorVariant = () => {
        if(props.color) return ''
        return 'default'
    }

    return (
        <Button
            fullWidth 
            variant={colorVariant()} 
            size="xs"
            color={props.color}
            disabled={props.disabled ? props.disabled : false}
            onClick={props.handler}
        >
            {props.title}
        </Button>
    )

}