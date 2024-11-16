import React from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Group } from '@mantine/core'
import { ButtonApp } from '../comps/ButtonApp.tsx'

export function ModalAddMode({text, leng, addContent, setAddContentMode}) {

  const [opened, { open, close }] = useDisclosure(false)

  const okContentModeHandler = () => {
                    addContent('addContent')
                    setAddContentMode(true)
  }

  return (
    <>
      <Modal size='sm' opened={opened} 
        onClose={close} 
        title={text.addContentMode[leng]}
      >
      <div style={{marginBottom: '3vmax'}}>
        {text.contentRule1[leng]}
        <br /><br />{text.contentRule2[leng]}
        <br /><br />{text.contentRule3[leng]}
      </div>
      <Group justify="flex-end">
      <ButtonApp title={text.ok[leng]} color={'green'} handler={okContentModeHandler} />
      <ButtonApp title={text.cancel[leng]} handler={close} />
      </Group>

      </Modal>
      <ButtonApp title={text.addContentMode[leng]} handler={open} color='green'/>
    </>
  )
}