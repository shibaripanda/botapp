
import '@mantine/core/styles.css'
import { useEffect, useState } from 'react'
import '../styles/App.css'
import { useConnectSocket } from '../socket/hooks/useConnectSocket.ts'
import { fix } from '../fix/fix.js'
import { CreateNewBotForm } from '../components/main/CreateNewBotForm.tsx'
import { BotItem } from '../components/main/BotItem.tsx'
import { pipSendSocket } from '../socket/pipSendSocket.ts'
import { pipGetSocket } from '../socket/pipGetSocket.ts'

export function MainPage() {
  console.log('main')
  useConnectSocket()

  const [status, setStatus] = useState(false)
  const [bots, setBots] = useState(false)

  const reverseBots = async (data) => {
    setBots(await data.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)))
  }

  useEffect(() => {
    if(!sessionStorage.getItem('token')){
      window.location.assign(fix.appLink)
    }
    else{
      const pipSocketListners = [
        {pip: 'getMyBots', handler: reverseBots},
      ]
      pipGetSocket(pipSocketListners)
      pipSendSocket('getMyBots')
      setStatus(true)
    }
  }, [])

  const deleteBot = (_id) => {
    pipSendSocket('deleteBot', _id)
    // SocketApt.socket.emit('deleteBot', _id)
  }
  const createBot = (token) => {
    pipSendSocket('createNewBot', token)
    // SocketApt.socket.emit('createNewBot', token)
  }
  const offBot = (_id) => {
    pipSendSocket('offBot', _id)
    // SocketApt.socket.emit('offBot', _id)
  }
  const onBot = (_id) => {
    pipSendSocket('onBot', _id)
    // SocketApt.socket.emit('onBot', _id)
  }

  
  if(bots && status){
    return (
      <div style={{width: '55vmax', marginTop: '3vmax', marginBottom: '3vmax'}}>
        <CreateNewBotForm createBot={createBot}/>
        {bots.map((item, index) => <div key={index} style={{marginTop: '1vmax'}}><BotItem bot={item} deleteBot={deleteBot} onBot={onBot} offBot={offBot}/></div>)}
      </div>
    )
  }
  else{
    return (
      <div style={{marginTop: '5vmax'}}>Loading...</div>
    )
  }

}

