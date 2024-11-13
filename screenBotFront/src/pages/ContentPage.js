
import '@mantine/core/styles.css'
import { useEffect, useMemo, useState } from 'react'
import '../styles/App.css'
import { useConnectSocket } from '../socket/hooks/useConnectSocket.ts'
import { fix } from '../fix/fix.js'
import { useNavigate, useParams } from 'react-router-dom'
import { Center, Grid } from '@mantine/core'
import { ContentList } from '../components/content/ContentList.tsx'
import { ModalAddMode } from '../components/content/ModalAddMode.tsx'
import { pipGetSocket } from '../socket/pipGetSocket.ts'
import { pipSendSocket } from '../socket/pipSendSocket.ts'
import { ButtonApp } from '../components/comps/ButtonApp.tsx'
import { TextInputApp } from '../components/comps/TextInputApp.tsx'
import { TextApp } from '../components/comps/TextApp.tsx'

export function ContentPage() {
  
  useConnectSocket()
  
  const {botId} = useParams()
  const {botName} = useParams()

  const navigate = useNavigate()
  const [filter, setFilter] = useState('')
  const [status, setStatus] = useState(false)
  const [content, setContent] = useState([])
  const [addContentmode, setAddContentMode] = useState('')

  const contentFilter = useMemo(() => {
      return content.filter(item => (Object.values(item).join()).toLowerCase().includes(filter.toLowerCase()))
    }, [filter, content]
  )

  useEffect(() => {
    if(!sessionStorage.getItem('token')){
      window.location.assign(fix.appLink)
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
    }
  }, [botId])

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
        <ModalAddMode addContent={addContent} setAddContentMode={setAddContentMode}/>
      )
    }
    return (
      <ButtonApp title='Stop Add-content mode' handler={handler.stopAddContentModeHandler} color='red' />
    )
  }

 
  if(status){
    return (
      <div style={{width: '100%', marginTop: '0.5vmax', marginBottom: '3vmax', marginLeft: '0.5vmax', marginRight: '0.5vmax'}}>

        <Grid justify="center" align="center">
            <Grid.Col span={2}>
              <ButtonApp title='Back to all bots' handler={() => navigate(`/main`)} color='grey'/>
            </Grid.Col>
            <Grid.Col span={3}>
              <Center>
                <TextApp title='Content:' text={botName} />
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
              <TextInputApp placeholder="Content filter" value={filter} handler={setFilter} />
            </Grid.Col>
          </Grid>

        <hr style={{marginTop: '0.5vmax', marginBottom: '0.5vmax'}}></hr>
        
        <ContentList data={contentFilter} renameMeContent={renameMeContent} deleteContent={deleteContent} sendMeContent={sendMeContent}/>
      </div>
    )
  }
  else{
    return (
      <div style={{marginTop: '5vmax'}}>Loading...</div>
    )
  }

}

