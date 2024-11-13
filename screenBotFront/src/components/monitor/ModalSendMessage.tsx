import React, { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Select, ComboboxItem, Textarea, Text } from '@mantine/core'

export function ModalSendMessage({content, userId, username, screens, activ, user, sendScreenToUser, sendTextToUser, sendContentToUser}) {

  const [opened, { open, close }] = useDisclosure(false)
  const [screen, setScreen] = useState<ComboboxItem | null>(null)
  const [text, setText] = useState('')

  const textButDis = (text) => {
    if(text){
      if(text.length > 4096) return true
      return false
    }
    return true
  }

  const textLength = (text) => {
    if(text.length > 4096){
      return <Text fz='sm' c='red'>Text {text.length}/4096</Text>
    }
    return <Text fz='sm' c='grey'>Text {text.length}/4096</Text>
  }

  return (
    <>
      <Modal size={'xl'} opened={opened} 
        onClose={close} 
        title={`Message to @${username}`}
      >
        <Select
          clearable
          searchable
          description={<Text fz='sm' c='grey'>Screen or content</Text>}
          style={{marginTop: '0.5vmax'}}
          data={
            screens.map(item => ({label: item.name + ' ( screen )', value: item._id}))
            .concat(content.map((item, index)=> ({label: (item.tx ? item.tx : 'noname') + ' ( ' + item.type + ' content )', value: 'content_' + index})))
          }
          value={screen ? screen.value : null}
          onChange={(_value, option) => {
            setScreen(option)
          }}
        />
        <Button variant="default" size="xs"
          style={{marginTop: '1.5vmax'}}
          disabled={!screen}
          onClick={() => {
            const res = screens.find(item => item._id === screen?.value)
            if(res){
              sendScreenToUser(res._id, userId)
              
            }
            else if(screen?.value.substring(0, 7) === 'content'){
              sendContentToUser(content[Number(screen.value.split('_')[1])], userId)
            }
            setScreen(null)
        }}>
        Send screen or content
        </Button>
        <Textarea
          autosize
          minRows={2}
          style={{marginTop: '3vmax'}}
          description={textLength(text)}
          value={text}
          onChange={(event) => setText(event.currentTarget.value)}
        />
        <Button variant="default" size="xs"
          style={{marginTop: '1.5vmax'}}
          disabled={textButDis(text)}
          onClick={() => {
            sendTextToUser(text, userId)
            setText('')
          }}>
          Send text
        </Button>
      </Modal>

      <Button variant="default" size="xs"
        disabled={!activ}
        onClick={() => {
            open()
            }}>
        Send message
      </Button>
    </>
  )
}