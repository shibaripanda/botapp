import '@mantine/core/styles.css'
import { useEffect, useState } from 'react'
import '../styles/App.css'
import { HelloScreen } from '../components/connect/HelloScreen.tsx'
import axios from 'axios'
import { LanguagePicker } from '../components/LanguagePicker/LanguagePicker.tsx'

export function ConnectPage() {

  const [text, setText] = useState(false)
  const [leng, setLeng] = useState(window.lengBotApp ? window.lengBotApp : 'en')
  const [avLeng, setAvLeng] = useState(false)

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

  useEffect(() => {
    sessionStorage.removeItem('token')
    getText()
    userLenguage()
  }, [])

  if(text){
    return (
      <div style={{marginTop: '10vmax'}}>
        <div style={{marginLeft: '1vmax', marginBottom: '1vmax'}}>
          <LanguagePicker avLeng={avLeng} setLeng={userSetLeng} leng={leng}/>
        </div>
        <HelloScreen text={text} leng={leng} avLeng={avLeng}/>
      </div>
    )
  }
  else{
    return (
      <div style={{marginTop: '5vmax'}}>Loading...</div>
    )
  }
  
}