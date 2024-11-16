
import '@mantine/core/styles.css'
import { useEffect, useMemo, useState } from 'react'
import '../styles/App.css'
import { useConnectSocket } from '../socket/hooks/useConnectSocket.ts'
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
import axios from 'axios'

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

  const [text, setText] = useState(window.textBotApp ? window.textBotApp: false)
  const [leng, setLeng] = useState(window.lengBotApp ? window.lengBotApp : false)

  async function getText(){
    const text = await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_SERVERLINK}/app/text`,
      timeout: 10000
    })
    window.textBotApp = text.data
    setText(text.data)
  }
  async function userLenguage(){
    const l = window.navigator.language.substring(0,2) ? window.navigator.language.substring(0,2) : 'en'
    const avLengs = await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_SERVERLINK}/app/avleng`,
      timeout: 10000
    })
    window.avlengBotApp = avLengs.data
    // setAvLeng(avLengs.data)
    if(!avLengs.data.map(item => item.index).includes(l)){
      window.lengBotApp = 'en'
      setLeng('en')
    }
    else{
      if(!window.lengBotApp){
        window.lengBotApp = l
        setLeng(l)
      }
    }
  }

  useEffect(() => {
    if(!sessionStorage.getItem('token')){
      window.location.assign(process.env.REACT_APP_BOTNAME)
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
      if(!text || !leng){
        console.log('update lenguage')
        getText()
        userLenguage()
      }
    }
  }, [])

  const eventFilter = useMemo(() => {
    console.log('memo events')
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

  if(bot && status && text && leng){
    return (
      <div style={{width: '100%', marginTop: '0.5vmax', marginBottom: '3vmax', marginLeft: '0.5vmax', marginRight: '0.5vmax'}}>

        <Grid align="center">
          <Grid.Col span={2}>
            <ButtonApp title={text.back[leng]} handler={() => navigate(`/main`)} color='grey'/>
          </Grid.Col>
          <Grid.Col span={3}>
            <Center>
              <TextApp title={`${text.events[leng]}:`} text={botName} />
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
            <TextInputApp placeholder={text.filter[leng]} value={filterEvents} handler={setFilterEvents}/>
          </Grid.Col>
        </Grid>

        <hr style={{marginTop: '0.5vmax'}}></hr>

        <Grid style={{marginTop: '0.5vmax', marginBottom: '0.5vmax'}}>
          <Grid.Col span={2}>
            <TextInputApp value={eventName} placeholder={text.eventName[leng]} handler={setEventName} />
          </Grid.Col>
          <Grid.Col span={2}>
            <ButtonApp 
            title={text.createNewEvent[leng]} 
            handler={() => {
              func.createEvent()
              setEventName('')
            }} 
            disabled={!eventName}/>
          </Grid.Col>
          {/* <Grid.Col span={2}>
            <ButtonApp title='Create a new one-time-event' handler={() => {func.createEvent({name: eventName}); setEventName('')}} disabled={!eventName}/>
          </Grid.Col> */}
        </Grid>

        <Grid>
          {eventFilter.map((item, index) => <Grid.Col key={index} span={4}>
            <EventItem
              text={text}
              leng={leng}
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

