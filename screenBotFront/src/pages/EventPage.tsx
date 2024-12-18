
import '@mantine/core/styles.css'
import React, { useEffect, useMemo, useState } from 'react'
import '../styles/App.css'
import { useConnectSocket } from '../socket/hooks/useConnectSocket.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { Center, Grid, Switch } from '@mantine/core'
import { EventItem } from '../components/events/EventItem.tsx'
import { ButtonApp } from '../components/comps/ButtonApp.tsx'
import { TextApp } from '../components/comps/TextApp.tsx'
import { TextInputApp } from '../components/comps/TextInputApp.tsx'
import { pipGetSocket } from '../socket/pipGetSocket.ts'
import { pipSendSocket } from '../socket/pipSendSocket.ts'
import axios from 'axios'
import { EventStatus } from '../modules/tsEnums.ts'

declare var process: any

export function EventPage(){

  const navigate = useNavigate()
  useConnectSocket()
  const {botId} = useParams()
  const {botName} = useParams()

  const [bot, setBot] = useState<any>(false)
  const [events, setEvents] = useState<any>([])
  const [filterEvents, setFilterEvents] = useState('')
  const [status, setStatus] = useState(false)
  const [eventName, setEventName] = useState('')
  const [checked, setChecked] = useState(false)
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
    console.log('test use')
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
      
      if(!text || !leng){
        console.log('update lenguage')
        getText()
        userLenguage()
      }
      setStatus(true)
    }
  }, [botId, leng, text])

  const eventFilter = useMemo(() => {
    if(!checked){
      return events.filter(item => item.name.toLowerCase().includes(filterEvents.toLowerCase()))
    }
      return events.filter(item => item.status === 'use').filter(item => item.name.toLowerCase().includes(filterEvents.toLowerCase()))
    }, [filterEvents, events, checked]
  )
  const newEventModule = {
    idEvent: Date.now() + 'Event',
    name: eventName,
    status: EventStatus.New,
    dateStartPeriod: [null, null],
    daysForDelete: [],
    checked: [0 ,1, 2, 3, 4, 5, 6],
    referensDay: false,
    currentEditDays: [],
    daysArrow: [],
    checkedEdit: [9 ,9, 9, 9, 9, 9, 9],
    checkedAll: false,
    days: []
  }
  const func = {
    createEvent: async () => pipSendSocket('createEvent', {botId: bot._id, event: newEventModule}),
    deleteEvent: async (event) => pipSendSocket('deleteEvent', {botId: bot._id, event: event}),
    updateEvent: async (event, newEvent) => pipSendSocket('updateEvent', {botId: bot._id, event: event, newEvent: newEvent}),
    createNamedGroup: async (group, groupName) => pipSendSocket('createNamedGroup', {botId: bot._id, group: group, groupName: groupName}),
    sendTextToUser: async (text, userId) => pipSendSocket('sendTextToUser', {botId: botId, text: text, to: userId})
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
          <Center>
            <Switch
            label={text.onlyActivEvents[leng]}
            radius="lg"
            color='green'
            checked={checked}
            onChange={(event) => {
              setChecked(event.currentTarget.checked)
            }}/>
          </Center>
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
              setEvents([])
            }} 
            disabled={!eventName}/>
          </Grid.Col>
          {/* <Grid.Col span={2}>
            <ButtonApp title='Create a new one-time-event' handler={() => {func.createEvent({name: eventName}); setEventName('')}} disabled={!eventName}/>
          </Grid.Col> */}
        </Grid>

        <Grid>
          {eventFilter.map((item, index) => <Grid.Col key={item.idEvent} span={4}>
            <EventItem
              setEvents={setEvents}
              text={text}
              leng={leng}
              updateEvent={func.updateEvent}
              oneEvent={item} 
              deleteEvent={func.deleteEvent}
              botId={botId}
              createNamedGroup={func.createNamedGroup}
              sendTextToUser={func.sendTextToUser}
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

