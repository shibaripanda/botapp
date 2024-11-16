
import '@mantine/core/styles.css'
import { useEffect, useMemo, useState } from 'react'
import '../styles/App.css'
import { useConnectSocket } from '../socket/hooks/useConnectSocket.ts'
import { useParams } from 'react-router-dom'
import { FindScreenForm } from '../components/botedit/screenList/FindScreenForm.tsx'
import { ScreenItem } from '../components/botedit/screenList/ScreenItem.tsx'
import { Grid } from '@mantine/core'
import { pipGetSocket } from '../socket/pipGetSocket.ts'
import { pipSendSocket } from '../socket/pipSendSocket.ts'
import axios from 'axios'

export function BotEditPage() {

  const {botId} = useParams()
  useConnectSocket()
  
  const [bot, setBot] = useState(false)
  const [screens, getScreens] = useState([])
  const [newScreenName, setNewScreenName] = useState('')
  const [filterScreens, setFilterScreens] = useState('')
  const [status, setStatus] = useState(false)
  const [spScreen, setSpScreen] = useState('')
  const [content, setContent] = useState([])
  const [events, setEvents] = useState([])

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

  const reverseScreens = async (data) => {
    getScreens(await data.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)))
  }

  useEffect(() => {
    if(!sessionStorage.getItem('token')){
      window.location.assign(process.env.REACT_APP_BOTNAME)
    }
    else{
      const pipSocketListners = [
        {pip: 'getBot', handler: setBot},
        {pip: 'getScreens', handler: reverseScreens},
        {pip: 'getContent', handler: setContent},
        {pip: 'getEvents', handler: setEvents}
      ]
      pipGetSocket(pipSocketListners)

      pipSendSocket('idForEditScreen', {botId: botId, screenId: ''})
      pipSendSocket('getContent', botId)
      pipSendSocket('getBot', botId)
      pipSendSocket('getScreens', botId)
      pipSendSocket('getEvents', botId)
      setStatus(true)
      if(!text || !leng){
        console.log('update lenguage')
        getText()
        userLenguage()
      }
    }
  }, [botId])

  const screenFilter = useMemo(() => {
      return screens.filter(item => item.name.toLowerCase().includes(filterScreens.toLowerCase()))
    }, [filterScreens, screens]
  )


  const protectScrreen = (screenId, status) => {
    pipSendSocket('protectScrreen', {botId: bot._id, status: status, screenId: screenId})
    screens[screens.findIndex(item => item._id === screenId)].protect = status
    getScreens(screens)
  }
  const clearScreen = async (screenId) => {
    pipSendSocket('clearScreen', {botId: bot._id, screenId: screenId})
  }
  const copyScreen = async (screenId) => {
    pipSendSocket('copyScreen', {botId: bot._id, screenId: screenId})
  }
  const deleteScreen = async (screenId) => {
    pipSendSocket('deleteScreen', screenId)
    getScreens(screens.filter(item => item._id !== screenId))
  }
  const editButtons = async (screenId, buttons) => {
    pipSendSocket('editButtons', {botId: bot._id, screenId: screenId, buttons: buttons})
  }
  const editScreenName = async (screenId, name) => {
    pipSendSocket('editScreenName', {botId: bot._id, screenId: screenId, name: name})
  }
  const createScreen = async (newScreenName) => {
    pipSendSocket('createNewScreen', {botId: bot._id, screenName: newScreenName})
  }
  const createEventScreen = async (newScreenName, idEvent) => {
    pipSendSocket('createEventScreen', {botId: bot._id, screenName: newScreenName, idEvent: idEvent})
  }
  const updateVariable = async (screenId, variable) => {
    pipSendSocket('updateVariable', {botId: bot._id, screenId: screenId, variable: variable})
  }
  const screenForAnswer = (screenId, ansScreen) => {
    pipSendSocket('screenForAnswer', {botId: bot._id, screenId: screenId, ansScreen: ansScreen})
  }
  const editScreen = (screenId) => {
    pipSendSocket('idForEditScreen', {botId: bot._id, screenId: screenId})
  }
  const sendMeScreen = (screenId) => {
    pipSendSocket('sendMeScreen', {botId: bot._id, screenId: screenId})
  }
  const deleteContentItem = async (screenId, content, index) => {
    pipSendSocket('deleteContentItem', {botId: bot._id, screenId: screenId, content: content, index: index})
  }
  const addContentItem = async (screenId, content) => {
    pipSendSocket('addContentItem', {botId: bot._id, screenId: screenId, content: content})
  }
  const updateEvent = async (event, newEvent) => {
    pipSendSocket('updateEvent', {botId: bot._id, event: event, newEvent: newEvent})
  }

  const loadingItem = () => {
    if(screens.length){
      return (
        screenFilter.map((item, index) => 
          <Grid.Col span={4} key={index}>
            <ScreenItem
              text={text}
              leng={leng}
              content={content}
              screens={screens}
              protectScrreen={protectScrreen} 
              editScreen={editScreen} 
              bot={bot} 
              screen={item} 
              sendMeScreen={sendMeScreen} 
              deleteScreen={deleteScreen}
              clearScreen={clearScreen}
              editButtons={editButtons}
              updateVariable={updateVariable}
              screenForAnswer={screenForAnswer}
              copyScreen={copyScreen}
              editScreenName={editScreenName}
              deleteContentItem={deleteContentItem}
              addContentItem={addContentItem} 
            />
          </Grid.Col>)
      )
    }
    return (
      <Grid.Col span={4} key={5000}>
        <div style={{marginTop: '10vmax', marginLeft: '8vmax'}}>
          Loading...
        </div>
      </Grid.Col>
    )
  }

  
  if(bot && screens && status && text && leng && events){
    return (
      <div style={{width: '75vmax', marginTop: '3vmax', marginBottom: '3vmax'}}>
        <Grid justify="flex-start" align="stretch">
          <Grid.Col span={8} key={1000}>
            <FindScreenForm
              updateEvent={updateEvent}
              createEventScreen={createEventScreen}
              events={events}
              text={text}
              leng={leng}
              bot={bot} 
              screens={screens}
              screenFilterLength={screenFilter.length} 
              createScreen={createScreen} 
              newScreenName={newScreenName} 
              setNewScreenName={setNewScreenName} 
              filterScreens={filterScreens}
              setFilterScreens={setFilterScreens}
              spScreen={spScreen} 
              setSpScreen={setSpScreen}
            />
          </Grid.Col>
          {loadingItem()}
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

