import React, { useState } from 'react'
import { Modal, Button, Textarea, Text } from '@mantine/core'

export function ModalSendMessageGroupEvent({text1, leng, users, sendTextToUser, opened, close}) {

  const [text, setText] = useState('')
  const [resalt, setResalt] = useState('')
  // const [visible, setVisible] = useState(false)

  const textButDis = (text) => {
    if(text){
      if(text.length > 4096) return true
      return false
    }
    return true
  }
  const textLength = (text) => {
    if(text.length > 4096){
      return <Text fz='sm' c='red'>{text1.text[leng]} {text.length}/4096</Text>
    }
    return <Text fz='sm' c='grey'>{text1.text[leng]} {text.length}/4096</Text>
  }

  return (
    <>
      <Modal size={'xl'} opened={opened} 
        onClose={() => {
          setResalt('')
          close()
        }}
        title={`${text1.mesToSelect[leng]} (${users.length}) ${resalt}`}
      >
        <Textarea autosize
          minRows={2}
          style={{marginTop: '3vmax'}}
          description={textLength(text)}
          value={text}
          onChange={(event) => setText(event.currentTarget.value)}
        />
        <Button variant="default" size="xs"
          style={{marginTop: '1.5vmax'}}
          disabled={textButDis(text)}
          onClick={async () => {
            setResalt('✉️')
            let time = 0
            for(let i of users){
              setTimeout(await sendTextToUser(text, i), time)
            }
            setResalt('✅')
            setText('')
          }}>
          {text1.sendText[leng]}
        </Button>
      </Modal>
    </>
  )
}