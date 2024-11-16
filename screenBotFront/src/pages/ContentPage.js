
import '@mantine/core/styles.css'
import { useEffect, useMemo, useState } from 'react'
import '../styles/App.css'
import { useConnectSocket } from '../socket/hooks/useConnectSocket.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { Center, Grid } from '@mantine/core'
import { ContentList } from '../components/content/ContentList.tsx'
import { ModalAddMode } from '../components/content/ModalAddMode.tsx'
import { pipGetSocket } from '../socket/pipGetSocket.ts'
import { pipSendSocket } from '../socket/pipSendSocket.ts'
import { ButtonApp } from '../components/comps/ButtonApp.tsx'
import { TextInputApp } from '../components/comps/TextInputApp.tsx'
import { TextApp } from '../components/comps/TextApp.tsx'
import axios from 'axios'

export function ContentPage() {
  
  useConnectSocket()
  
  const {botId} = useParams()
  const {botName} = useParams()

  const navigate = useNavigate()
  const [filter, setFilter] = useState('')
  const [status, setStatus] = useState(false)
  const [content, setContent] = useState([])
  const [addContentmode, setAddContentMode] = useState('')

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

  const contentFilter = useMemo(() => {
      return content.filter(item => (Object.values(item).join()).toLowerCase().includes(filter.toLowerCase()))
    }, [filter, content]
  )

  useEffect(() => {
    if(!sessionStorage.getItem('token')){
      window.location.assign(process.env.REACT_APP_BOTNAME)
    }
    else{
      const pipSocketListners = [
        {pip: 'getContent', handler: setContent},
        {pip: 'getAddContentMode', handler: setAddContentMode}
      ]
      pipGetSocket(pipSocketListners)

      pipSendSocket('getContent', botId)
      pipSendSocket('getAddContentMode', botId)
      setStatus(true)
      if(!text || !leng){
        console.log('update lenguage')
        getText()
        userLenguage()
      }
    }
  }, [])

  const addContent = (status) => {
    pipSendSocket('idForEditScreen', {botId: botId, screenId: status})
  }
  const deleteContent = (item) => {
    pipSendSocket('deleteContent', {botId: botId, content: item})
  }
  const sendMeContent = (item) => {
    pipSendSocket('sendMeContent', {botId: botId, content: item})
  }
  const renameMeContent = (item, newName) => {
    pipSendSocket('renameMeContent', {botId: botId, content: item, newName: newName})
  }

  const handler = {
    stopAddContentModeHandler: () => {
                      addContent('')
                      setAddContentMode(false)
    }
  }

  const addContentButtonStatus = () => {
    if(!addContentmode){
      return (
        <ModalAddMode text={text} leng={leng} addContent={addContent} setAddContentMode={setAddContentMode}/>
      )
    }
    return (
      <ButtonApp title={`STOP ${text.addContentMode[leng]}`} handler={handler.stopAddContentModeHandler} color='red' />
    )
  }

 
  if(status && text && leng){
    return (
      <div style={{width: '100%', marginTop: '0.5vmax', marginBottom: '3vmax', marginLeft: '0.5vmax', marginRight: '0.5vmax'}}>

        <Grid justify="center" align="center">
            <Grid.Col span={2}>
              <ButtonApp title={text.back[leng]} handler={() => navigate(`/main`)} color='grey'/>
            </Grid.Col>
            <Grid.Col span={3}>
              <Center>
                <TextApp title={`${text.content[leng]}:`} text={botName} />
              </Center>
            </Grid.Col>
            <Grid.Col span={3.5}>
              {addContentButtonStatus()}
            </Grid.Col>
            <Grid.Col span={1.5}>
              <Center>
                <TextApp title='' text={`${contentFilter.length} / ${content.length}`} />
              </Center>
            </Grid.Col>
            <Grid.Col span={2}>
              <TextInputApp placeholder={text.filter[leng]} value={filter} handler={setFilter} />
            </Grid.Col>
          </Grid>

        <hr style={{marginTop: '0.5vmax', marginBottom: '0.5vmax'}}></hr>
        
        <ContentList text={text} leng={leng} data={contentFilter} renameMeContent={renameMeContent} deleteContent={deleteContent} sendMeContent={sendMeContent}/>
      </div>
    )
  }
  else{
    return (
      <div style={{marginTop: '5vmax'}}>Loading...</div>
    )
  }

}

