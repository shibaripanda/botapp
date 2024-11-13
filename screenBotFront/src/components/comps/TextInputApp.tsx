import { TextInput } from "@mantine/core"
import React from "react"

export const TextInputApp = (props) => {

    return (
        <TextInput
           label={props.label}
           size='xs'
           placeholder={props.placeholder}
           value={props.value}
           onChange={(event) => {
            props.handler(event.currentTarget.value)
          }}
       />
   )
   
}