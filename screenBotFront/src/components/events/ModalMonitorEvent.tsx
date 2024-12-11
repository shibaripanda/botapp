import React, { useEffect, useMemo, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Group, Modal, Switch } from '@mantine/core'
import { ButtonApp } from '../comps/ButtonApp.tsx'
import { pipGetSocket } from '../../socket/pipGetSocket.ts'
import { pipSendSocket } from '../../socket/pipSendSocket.ts'
import { DayTable } from './DayTable.tsx'

interface EventUse {
  idEvent: string
  name: string
  dateStartAndStop: []
  days: Day[]
}

interface Day {
  day: any
  slots: Slots[]
}

interface Slots {
  clients: []
}

export function ModalMonitorEvent({sendTextToUser, createNamedGroup, text, leng, oneEvent, botId}) {

  const [opened, { open, close }] = useDisclosure(false)
  const [event, setEvent] = useState<EventUse | false>(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const pipSocketListners = [
      {pip: `getEvent|${oneEvent.idEvent}`, handler: setEvent}
    ]
    pipGetSocket(pipSocketListners)
    pipSendSocket(`getEvent`, {botId: botId, idEvent: oneEvent.idEvent})
  }, [oneEvent.idEvent, botId])

  const slotsFilter = useMemo(() => {
    if(event){
      if(!checked){
        return event.days
      }
      return event.days.filter(item => item.slots.reduce((acc, item) => acc + item.clients.length, 0) > 0)
    }
    
    }, [event, checked]
  )

  const countRegUsers = (days) => {
    const allTickets = days.reduce((acc, item) => acc + item.slots.reduce((acc1, item1) => acc1 + item1.maxClients, 0), 0)
    const regUsers = days.reduce((acc, item) => acc + item.slots.reduce((acc1, item1) => acc1 + item1.clients.length, 0), 0)
    const res = ' ( ' + regUsers + ' / ' + allTickets + ' )'
    return res
  }

  const deleteUserRegistration = async (indexDay, indexSlot, client) => {
    pipSendSocket('deleteUserRegistration', {idEvent: oneEvent.idEvent, indexDay: indexDay, indexSlot: indexSlot, client: client})
  }

  const topLine = () => {
    if(event){
      return (
        <Group gap="xl">
          <div>{event.name}</div>
          <div>{countRegUsers(event.days)}</div>
          <Switch
            label={text.onlyActivSlots[leng]}
            radius="lg"
            color='green'
            checked={checked}
            onChange={(event) => {
              setChecked(event.currentTarget.checked)
            }}/>
        </Group>
      )
    }
  }


  if(event && slotsFilter){
      return (
        <>
          <Modal opened={opened} 
            onClose={close}
            fullScreen
            title={topLine()}
          >
            <>
            {slotsFilter.map((item, index) => <DayTable sendTextToUser={sendTextToUser} text={text} leng={leng} eventName={event.name} createNamedGroup={createNamedGroup} checked={checked} key={index} day={item} deleteUserRegistration={deleteUserRegistration} indexDay={index}/>)}

            </>
          </Modal>
          <ButtonApp title={text.open[leng]} handler={open} color={'green'}/>
        </>
      )
  }
  else{
      return (
        <div>Loading...</div>
      )
  }
  
}