import React, { useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal } from '@mantine/core'
import { ButtonApp } from '../comps/ButtonApp.tsx'
import { pipGetSocket } from '../../socket/pipGetSocket.ts'
import { pipSendSocket } from '../../socket/pipSendSocket.ts'

interface EventUse {
  idEvent: string
  name: string
  dateStartAndStop: []
  days: []
}

export function ModalMonitorEvent({text, leng, oneEvent}) {

  const [opened, { open, close }] = useDisclosure(false)
  const [event, setEvent] = useState<EventUse | false>(false)

  useEffect(() => {
    const pipSocketListners = [
      {pip: `getEvent|${oneEvent.idEvent}`, handler: setEvent}
    ]
    pipGetSocket(pipSocketListners)
    pipSendSocket(`getEvent`, oneEvent.idEvent)
  }, [oneEvent.idEvent])



  const dayList = (days) => {
    for(const i of days){
      return new Date(i.day).getDate()
    }
  }

  if(event){
      return (
        <>
          <Modal size={'65vmax'} opened={opened} 
            onClose={close}
            fullScreen
            title={'dfdfdfd'}
          >
            <>
            {dayList(event.days)}

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