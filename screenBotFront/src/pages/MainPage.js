
import '@mantine/core/styles.css'
import { useEffect, useState } from 'react'
import '../styles/App.css'
import { useConnectSocket } from '../socket/hooks/useConnectSocket.ts'
import { CreateNewBotForm } from '../components/main/CreateNewBotForm.tsx'
import { BotItem } from '../components/main/BotItem.tsx'
import { pipSendSocket } from '../socket/pipSendSocket.ts'
import { pipGetSocket } from '../socket/pipGetSocket.ts'
import axios from 'axios'
import { LanguagePicker } from '../components/LanguagePicker/LanguagePicker.tsx'

export function MainPage() {
  console.log('Main page')
  useConnectSocket()

  const [status, setStatus] = useState(false)
  const [bots, setBots] = useState(false)

  const [text, setText] = useState(window.textBotApp ? window.textBotApp: false)
  const [leng, setLeng] = useState(window.lengBotApp ? window.lengBotApp : false)
  const [avLeng, setAvLeng] = useState(window.avlengBotApp ? window.avlengBotApp : false)

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
    setAvLeng(avLengs.data)
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
  async function userSetLeng(leng) {
    window.lengBotApp = leng
    setLeng(leng)
  }

  const reverseBots = async (data) => {
    setBots(await data.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)))
  }

  useEffect(() => {
    if(!sessionStorage.getItem('token')){
      window.location.assign(process.env.REACT_APP_BOTNAME)
    }
    else{
      const pipSocketListners = [
        {pip: 'getMyBots', handler: reverseBots},
      ]
      pipGetSocket(pipSocketListners)
      pipSendSocket('getMyBots')
      setStatus(true)
      if(!text || !leng || !avLeng){
        console.log('update lenguage')
        getText()
        userLenguage()
      }
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

  
  if(bots && status && text && avLeng && leng){
    return (
      <div style={{width: '55vmax', marginTop: '3vmax', marginBottom: '3vmax'}}>
        <div style={{marginBottom: '1vmax'}}>
          <LanguagePicker avLeng={avLeng} setLeng={userSetLeng} leng={leng}/>
        </div>
        <CreateNewBotForm createBot={createBot} text={text} leng={leng}/>
        {bots.map((item, index) => <div key={index} style={{marginTop: '1vmax'}}><BotItem text={text} leng={leng} bot={item} deleteBot={deleteBot} onBot={onBot} offBot={offBot}/></div>)}
      </div>
    )
  }
  else{
    return (
      <div style={{marginTop: '5vmax'}}>Loading...</div>
    )
  }

}

