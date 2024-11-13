import React, { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Text, Group, Switch, Grid, Spoiler, Tooltip, TextInput, Autocomplete, Image } from '@mantine/core'

export function ModalCreateEventOneTime({createEvent}) {

  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Modal size={'65vmax'} opened={opened} 
        onClose={() => {
            setTimeout(() => {close()}, )
            }} 
        title='modalTitle'
      >
        
        <Grid>
          <Grid.Col span={12}>
            <Button variant="default" size="xs" fullWidth
              onClick={() => {
                  createEvent({name: 'Test_1'})
                  // open()
                  }}>
              Create a permanent event
            </Button>
          </Grid.Col>
        </Grid>

      </Modal>

      <Button variant="default" size="xs" fullWidth
        onClick={() => {
            open()
            }}>
        Create a one-time event 
      </Button>
    </>
  )
}