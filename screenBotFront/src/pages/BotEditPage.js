
import '@mantine/core/styles.css'
import { useEffect, useMemo, useState } from 'react'
import '../styles/App.css'
import { useConnectSocket } from '../socket/hooks/useConnectSocket.ts'
import { fix } from '../fix/fix.js'
import { useParams } from 'react-router-dom'
import { FindScreenForm } from '../components/botedit/screenList/FindScreenForm.tsx'
import { ScreenItem } from '../components/botedit/screenList/ScreenItem.tsx'
import { Grid } from '@mantine/core'
import { pipGetSocket } from '../socket/pipGetSocket.ts'
import { pipSendSocket } from '../socket/pipSendSocket.ts'

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

  const reverseScreens = async (data) => {
    getScreens(await data.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)))
  }

  useEffect(() => {
    if(!sessionStorage.getItem('token')){
      window.location.assign(fix.appLink)
    }
    else{
      const pipSocketListners = [
        {pip: 'getBot', handler: setBot},
        {pip: 'getScreens', handler: reverseScreens},
        {pip: 'getContent', handler: setContent}
      ]
      pipGetSocket(pipSocketListners)

      pipSendSocket('idForEditScreen', {botId: botId, screenId: ''})
      pipSendSocket('getContent', botId)
      pipSendSocket('getBot', botId)
      pipSendSocket('getScreens', botId)
      setStatus(true)
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

  const loadingItem = () => {
    if(screens.length){
      return (
        screenFilter.map((item, index) => 
          <Grid.Col span={4} key={index}>
            <ScreenItem
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

  
  if(bot && screens && status){
    return (
      <div style={{width: '75vmax', marginTop: '3vmax', marginBottom: '3vmax'}}>
        <Grid justify="flex-start" align="stretch">
          <Grid.Col span={8} key={1000}>
            <FindScreenForm
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

