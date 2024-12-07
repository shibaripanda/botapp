import React, { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Textarea, Text, Anchor } from '@mantine/core'

export function ModalSendMessageEvent({text1, leng, userId, username, sendTextToUser}) {

  const [opened, { open, close }] = useDisclosure(false)
  // const [text, setText] = useState('')

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
    {/* <Modal.Stack> */}
      {/* <Modal size={'xl'} opened={opened1} 
        onClose={close} 
        title={`${text1.message[leng]} to @${username}`}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Textarea
          data-autofocus
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
          {text1.sendText[leng]}
        </Button>
      </Modal> */}
      <Modal.Root opened={opened} onClose={close}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Modal title</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>Modal content</Modal.Body>
        </Modal.Content>
      </Modal.Root>
      {/* </Modal.Stack> */}

      <Anchor size='sm' 
        onClick={open}>
        {text1.sendMes[leng]}
      </Anchor>

      {/* <Button onClick={open}>{text1.sendMes[leng]}</Button> */}
    </>
  )
}