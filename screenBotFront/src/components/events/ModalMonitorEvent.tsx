import React, { useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal } from '@mantine/core'
import { ButtonApp } from '../comps/ButtonApp.tsx'
import { pipGetSocket } from '../../socket/pipGetSocket.ts'
import { pipSendSocket } from '../../socket/pipSendSocket.ts'
import { DayTable } from './DayTable.tsx'

interface EventUse {
  idEvent: string
  name: string
  dateStartAndStop: []
  days: []
}

export function ModalMonitorEvent({text, leng, oneEvent, botId}) {

  const [opened, { open, close }] = useDisclosure(false)
  const [event, setEvent] = useState<EventUse | false>(false)

  useEffect(() => {
    const pipSocketListners = [
      {pip: `getEvent|${oneEvent.idEvent}`, handler: setEvent}
    ]
    pipGetSocket(pipSocketListners)
    pipSendSocket(`getEvent`, {botId: botId, idEvent: oneEvent.idEvent})
  }, [oneEvent.idEvent, botId])

  const countRegUsers = (days) => {
    const allTickets = days.reduce((acc, item) => acc + item.slots.reduce((acc1, item1) => acc1 + item1.maxClients, 0), 0)
    const regUsers = days.reduce((acc, item) => acc + item.slots.reduce((acc1, item1) => acc1 + item1.clients.length, 0), 0)
    return ' ( ' + regUsers + ' / ' + allTickets + ' )'
  }

  const deleteUserRegistration = async (indexDay, indexSlot, client) => {
    pipSendSocket('deleteUserRegistration', {idEvent: oneEvent.idEvent, indexDay: indexDay, indexSlot: indexSlot, client: client})
  }


  if(event){
      return (
        <>
          <Modal opened={opened} 
            onClose={close}
            fullScreen
            title={event.name + ' ' + countRegUsers(event.days)}
          >
            <>
            {event.days.map((item, index) => <DayTable key={index} day={item} deleteUserRegistration={deleteUserRegistration} indexDay={index}/>)}

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