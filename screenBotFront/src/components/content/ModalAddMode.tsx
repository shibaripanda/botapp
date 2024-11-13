import React from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Group } from '@mantine/core'
import { ButtonApp } from '../comps/ButtonApp.tsx'

export function ModalAddMode({addContent, setAddContentMode}) {

  const [opened, { open, close }] = useDisclosure(false)

  const okContentModeHandler = () => {
                    addContent('addContent')
                    setAddContentMode(true)
  }

  return (
    <>
      <Modal size='sm' opened={opened} 
        onClose={close} 
        title={'Add content mode'}
      >
      <div style={{marginBottom: '3vmax'}}>
        Don't forget to turn off the mode when you add content
        <br /><br />Switching to edit or monitor mode will automatically turn off this mode
        <br /><br />After pressing "ok" send the required content to your bot, use the Telegram app
      </div>
      <Group justify="flex-end">
      <ButtonApp title='Ok' color={'green'} handler={okContentModeHandler} />
      <ButtonApp title='Cancel' handler={close} />
      </Group>

      </Modal>
      <ButtonApp title='Add-content mode' handler={open} color='green'/>
    </>
  )
}