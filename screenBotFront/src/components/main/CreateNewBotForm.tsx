import React, { useState } from 'react'
import { Anchor, Button, Paper, TextInput } from '@mantine/core'
import { SocketApt } from '../../socket/api/socket-api.ts'

export function CreateNewBotForm(props) {

    const link = <div>{props.text.createNewBot[props.leng]} <Anchor size='sm' href="https://t.me/BotFather" target="_blank">BotFather</Anchor></div>

    const [value, setValue] = useState('')
    const [resStatus, setResStatus] = useState(link)

    SocketApt.socket?.on('createNewBot', (data) => {
        setResStatus(data)
    })

    const activButton = () => {
        if(value !== '') return false
        return true
    }

    return (
        <Paper withBorder p="lg" radius="md" shadow="md">
            <TextInput
            size="sm"
            label={resStatus}
            description='Token from BotFather:'
            placeholder={props.text.token[props.leng]}
            value={value}
            onChange={(event) => {
                setResStatus(link)
                setValue(event.currentTarget.value)
            }}
            />
            <Button
                size="xs" 
                style={{marginTop: '1vmax'}}
                disabled={activButton()}
                onClick={()=> {
                    props.createBot(value)
                    setValue('')
                }}
                >
                {props.text.create[props.leng]}
            </Button>
        </Paper>
    )

}