
import '@mantine/core/styles.css'
import { useEffect, useMemo, useState } from 'react'
import '../styles/App.css'
import { useConnectSocket } from '../socket/hooks/useConnectSocket.ts'
import { fix } from '../fix/fix.js'
import { useNavigate, useParams } from 'react-router-dom'
import { Center, Grid } from '@mantine/core'
import { EventItem } from '../components/events/EventItem.tsx'
// import { ModalCreateEventOneTime } from '../components/events/ModalCreateEventOneTime.tsx'
// import { ModalCreateEventPermament } from '../components/events/ModalCreateEventPermament.tsx'
import { ButtonApp } from '../components/comps/ButtonApp.tsx'
import { TextApp } from '../components/comps/TextApp.tsx'
import { TextInputApp } from '../components/comps/TextInputApp.tsx'
import { pipGetSocket } from '../socket/pipGetSocket.ts'
import { pipSendSocket } from '../socket/pipSendSocket.ts'

export function EventPage() {
console.log('s')
  const navigate = useNavigate()
  useConnectSocket()
  const {botId} = useParams()
  const {botName} = useParams()

  const [bot, setBot] = useState(false)
  const [events, setEvents] = useState([])
  // const [newEventName, setNewEventName] = useState('')
  const [filterEvents, setFilterEvents] = useState('')
  const [status, setStatus] = useState(false)
  const [eventName, setEventName] = useState('')

  useEffect(() => {
    if(!sessionStorage.getItem('token')){
      window.location.assign(fix.appLink)
    }
    else{
      const pipSocketListners = [
        {pip: 'getBot', handler: setBot},
        {pip: 'getEvents', handler: setEvents}
      ]
      pipGetSocket(pipSocketListners)
      pipSendSocket('getBot', botId)
      pipSendSocket('getEvents', botId)
      setStatus(true)
    }
  }, [])

  const eventFilter = useMemo(() => {
      return events.filter(item => item.name.toLowerCase().includes(filterEvents.toLowerCase()))
    }, [filterEvents, events]
  )

  const newEventModule = {
    idEvent: Date.now() + 'Event',
    name: eventName, 
    slots:[{
      idSlot: Date.now() + 'Slot', 
      startTime: '09:00', 
      duration: 45, 
      break: 15, 
      clients: [], 
      maxClients: 1,
      openForRegistration: true
    }]
  }
  
  const func = {
    createEvent: async () => pipSendSocket('createEvent', {botId: bot._id, event: newEventModule}),
    deleteEvent: async (event) => pipSendSocket('deleteEvent', {botId: bot._id, event: event}),
    updateEvent: async (event, newEvent) => pipSendSocket('updateEvent', {botId: bot._id, event: event, newEvent: newEvent})
  }

  if(bot && status){
    return (
      <div style={{width: '100%', marginTop: '0.5vmax', marginBottom: '3vmax', marginLeft: '0.5vmax', marginRight: '0.5vmax'}}>

        <Grid align="center">
          <Grid.Col span={2}>
            <ButtonApp title='Back to all bots' handler={() => navigate(`/main`)} color='grey'/>
          </Grid.Col>
          <Grid.Col span={3}>
            <Center>
              <TextApp title='Events:' text={botName} />
            </Center>
          </Grid.Col>
          <Grid.Col span={3.5}>
          </Grid.Col>
          <Grid.Col span={1.5}>
            <Center>
              <TextApp title='' text={`${eventFilter.length} / ${events.length}`} />
            </Center>
          </Grid.Col>
          <Grid.Col span={2}>
            <TextInputApp placeholder='Event filter' value={filterEvents} handler={setFilterEvents}/>
          </Grid.Col>
        </Grid>

        <hr style={{marginTop: '0.5vmax'}}></hr>

        <Grid style={{marginTop: '0.5vmax', marginBottom: '0.5vmax'}}>
          <Grid.Col span={2}>
            <TextInputApp value={eventName} placeholder={'Event name'} handler={setEventName} />
          </Grid.Col>
          <Grid.Col span={2}>
            <ButtonApp 
            title='Create a new multi-event' 
            handler={() => {
              func.createEvent()
              setEventName('')
            }} 
            disabled={!eventName}/>
          </Grid.Col>
          <Grid.Col span={2}>
            <ButtonApp title='Create a new one-time-event' handler={() => {func.createEvent({name: eventName}); setEventName('')}} disabled={!eventName}/>
          </Grid.Col>
        </Grid>

        <Grid>
          {eventFilter.map((item, index) => <Grid.Col key={index} span={4}>
            <EventItem
              updateEvent={func.updateEvent}
              oneEvent={item} 
              deleteEvent={func.deleteEvent}
            />
            </Grid.Col>)}
        </Grid>
        
      </div>
    )
  }
  else{
    return (
      <div style={{marginTop: '5vmax'}}>Loading...</div>
    )
  }

}

