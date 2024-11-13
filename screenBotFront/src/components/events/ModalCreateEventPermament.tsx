import React, { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Grid, Paper, TextInput, Slider } from '@mantine/core'
import { ButtonApp } from '../comps/ButtonApp.tsx'
import { TimeInput } from '@mantine/dates'

export function ModalCreateEventPermament({oneEvent, updateEvent}) {

  const [opened, { open, close }] = useDisclosure(false)
  // const [eventName, setEventName] = useState(oneEvent.name)
  const [editedEvent, setEditedEvent] = useState(oneEvent)
  const [stat, setStat] = useState(0)
  // const [value, setValue] = useState<number | string>(2200)


  const handlers = {
    addSlot: () => {
      console.log(stat)
      const clock = editedEvent.slots[editedEvent.slots.length - 1].startTime.split(':')
      let x = Number(clock[1]) + editedEvent.slots[editedEvent.slots.length - 1].duration + editedEvent.slots[editedEvent.slots.length - 1].break
      const upH = Number(clock[0]) + Math.floor(x / 60)
      const upM = x % 60

      const timeToTwoDigits = (digit: number) => {
        if(digit.toString().length === 1){
          return '0' + digit
        }
        return digit
      }
      if(Number(timeToTwoDigits(upH)) < 24){
        editedEvent.slots[editedEvent.slots.length] = structuredClone(editedEvent.slots[editedEvent.slots.length - 1])
        editedEvent.slots[editedEvent.slots.length - 1].startTime = `${timeToTwoDigits(upH)}:${timeToTwoDigits(upM)}`
        setStat(Date.now())
      }
    },
    getTimeNextEvent: () => {
      const clock = editedEvent.slots[editedEvent.slots.length - 1].startTime.split(':')
      let x = Number(clock[1]) + editedEvent.slots[editedEvent.slots.length - 1].duration + editedEvent.slots[editedEvent.slots.length - 1].break
      const upH = Number(clock[0]) + Math.floor(x / 60)
      const upM = x % 60

      const timeToTwoDigits = (digit: number) => {
        if(digit.toString().length === 1){
          return '0' + digit
        }
        return digit
      }
      if(Number(timeToTwoDigits(upH)) < 24){
        return (
          <ButtonApp title={`Add slot ${timeToTwoDigits(upH)}:${timeToTwoDigits(upM)}`} handler={handlers.addSlot} />
        )
        // setStat(Date.now())
      }
      return (
        <ButtonApp title={`Add slot`} disabled={true}/>
      )
      
    },
    openForReg: (item) => {
      if(item.onepForResistration){
        return (
          <ButtonApp
            title={'Close for registration'}
            handler={() => {
              item.onepForResistration = false
              setStat(Date.now())
            }}
        />
        )
      }
      return (
        <ButtonApp
          title={'Open for registration'}
          handler={() => {
            item.onepForResistration = true
            setStat(Date.now())
          }}
      />
      )

    }
  }

  console.log(editedEvent.slots)
  const dayEvents = editedEvent.slots.map((item, index) => 
    <Grid.Col key={index} span={12}>
      <Paper withBorder p="lg" radius="md" shadow="md">
        <Grid align="flex-end">
          <Grid.Col span={3}>
          <TimeInput
            disabled={index !== editedEvent.slots.length - 1 || editedEvent.slots.length !== 1}
            value={item.startTime}
            onChange={(event) => {
              item.startTime = event.currentTarget.value
              setStat(Date.now())
            }}
            size="xs"
            radius="sm"
            label="Start slot"
          />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              disabled={index !== editedEvent.slots.length - 1}
              onChange={(event) => {
                item.duration = Number(event.currentTarget.value)
                setStat(Date.now())
              }}
              value={item.duration}
              size="xs"
              radius="sm"
              label="Duration minutes"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              disabled={index !== editedEvent.slots.length - 1}
              onChange={(event) => {
                item.break = Number(event.currentTarget.value)
                setStat(Date.now())
              }}
              value={item.break}
              size="xs"
              radius="sm"
              label="Break minutes"
            />
            <Slider
              disabled={index !== editedEvent.slots.length - 1}
              max={180}
              step={5}
              min={0}
              label={null}
              value={item.break}
              onChange={(event) => {
                item.break = event
                setStat(Date.now())
              }}
              size={2}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <ButtonApp
              title={'Delete'}
              disabled={index !== editedEvent.slots.length - 1 || editedEvent.slots.length === 1}
              handler={() => {
                editedEvent.slots.splice(-1)
                setStat(Date.now())
              }}
            />
          </Grid.Col>
        </Grid>
      </Paper>
    </Grid.Col>
  )

  return (
    <>
      <Modal size={'65vmax'} opened={opened} 
        onClose={close}
        title={editedEvent.name}
      >
        <Grid>
          <Grid.Col span={6}>
          <TextInput
              onChange={(event) => {
                editedEvent.name = event.currentTarget.value
                setStat(Date.now())
              }}
              value={editedEvent.name}
              size="xs"
              radius="sm"
              label="Multi event name"
            />
          </Grid.Col>
            {dayEvents}
          <Grid.Col span={12}>
            <Grid>
              <Grid.Col span={4}>
                {handlers.getTimeNextEvent()}
              </Grid.Col>
              <Grid.Col span={2}>
                
              </Grid.Col>
              <Grid.Col span={2}>
                
              </Grid.Col>
              <Grid.Col span={2}>
              <ButtonApp 
                  title={'Cancel'} 
                  handler={() => {
                    setEditedEvent(oneEvent)
                    close()
                  }}
                  disabled={JSON.stringify(oneEvent) === JSON.stringify(editedEvent)}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <ButtonApp 
                  title={'Save'} 
                  handler={() => updateEvent(oneEvent, editedEvent)} 
                  disabled={JSON.stringify(oneEvent) === JSON.stringify(editedEvent)}
                />
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
     

      </Modal>
      <ButtonApp title='Edit' handler={open} />
    </>
  )
}