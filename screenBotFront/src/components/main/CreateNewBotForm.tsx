import React, { useMemo, useState } from 'react'
import { Anchor, Button, Paper, TextInput } from '@mantine/core'
import { SocketApt } from '../../socket/api/socket-api.ts'

export function CreateNewBotForm(props) {

    const [value, setValue] = useState('')
    const [resStatus, setResStatus] = useState(<div>{props.text.createNewBot[props.leng]} <Anchor size='sm' href="https://t.me/BotFather" target="_blank">BotFather</Anchor></div>)

    useMemo(() => {
        setResStatus(<div>{props.text.createNewBot[props.leng]} <Anchor size='sm' href="https://t.me/BotFather" target="_blank">BotFather</Anchor></div>)
    }, [setResStatus, props.leng, props.text.createNewBot])

    SocketApt.socket?.on('createNewBot', (data) => {
        console.log(data)
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
                setResStatus(resStatus)
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