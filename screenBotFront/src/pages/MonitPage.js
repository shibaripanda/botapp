
import '@mantine/core/styles.css'
import React, { useEffect, useMemo, useState } from 'react'
import '../styles/App.css'
import { useConnectSocket } from '../socket/hooks/useConnectSocket.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { Center, Grid, Switch } from '@mantine/core'
import { UserList } from '../components/monitor/UserList.tsx'
import { ModalSendMessageGroup } from '../components/monitor/ModalSendMessageGroup.tsx'
import { GroupListMenu } from '../components/monitor/GroupListMenu.tsx'
import { pipGetSocket } from '../socket/pipGetSocket.ts'
import { pipSendSocket } from '../socket/pipSendSocket.ts'
import { ButtonApp } from '../components/comps/ButtonApp.tsx'
import { TextApp } from '../components/comps/TextApp.tsx'
import { TextInputApp } from '../components/comps/TextInputApp.tsx'
import axios from 'axios'

export function MonitPage() {
  
  useConnectSocket()

  const {botId} = useParams()
  const {botName} = useParams()

  const navigate = useNavigate()
  const [checked, setChecked] = useState(true)
  const [filter, setFilter] = useState('')
  const [status, setStatus] = useState(false)
  const [users, setUsers] = useState([])
  const [screens, getScreens] = useState([])
  const [content, setContent] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [groups, setGroups] = useState([])
  const [activGroup, setActivGroup] = useState({})
  const [rename, setRename] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')

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

  const usersFilter = useMemo(() => {
      const checkActiv = () => {
        if(checked) return [true]
        return [true, false]
      }
      const groupFilter = (id) => {
        if(typeof activGroup['group'] !== 'undefined') return activGroup.group.includes(id)
          return true
      }
      return users.filter(item => (Object.values(item.data).join() + item.username + item._id).toLowerCase().includes(filter.toLowerCase()) && checkActiv().includes(item.activBot) && groupFilter(item.id))
    }, [filter, users, checked, activGroup]
  )

  useEffect(() => {
    if(!sessionStorage.getItem('token')){
      window.location.assign(process.env.REACT_APP_BOTNAME)
    }
    else{
      const pipSocketListners = [
        {pip: 'getUsers', handler: setUsers},
        {pip: 'getScreens', handler: getScreens},
        {pip: 'getContent', handler: setContent},
        {pip: 'getGroups', handler: setGroups}
      ]
      pipGetSocket(pipSocketListners)

      pipSendSocket('getGroups', botId)
      pipSendSocket('getContent', botId)
      pipSendSocket('getUsers', botId)
      pipSendSocket('getScreens', botId)
      pipSendSocket('idForEditScreen', {botId: botId, screenId: ''})
      setStatus(true)
      if(!text || !leng){
        console.log('update lenguage')
        getText()
        userLenguage()
      }
    }
  }, [botId])

  const sendScreenToUser = (screenId, userId) => {
    pipSendSocket('sendScreenToUser', {botId: botId, screenId: screenId, to: userId})
  }
  const sendTextToUser = (text, userId) => {
    pipSendSocket('sendTextToUser', {botId: botId, text: text, to: userId})
  }
  const sendContentToUser = (item, userId) => {
    pipSendSocket('sendContentToUser', {botId: botId, userId: userId, content: item})
  }
  const createGroup = (group) => {
    pipSendSocket('createGroup', {botId: botId, group: group})
  }
  const deleteGroup = (group) => {
    pipSendSocket('deleteGroup', {botId: botId, group: group})
  }
  const renameGroup = (group, name) => {
    pipSendSocket('renameGroup', {botId: botId, group: group, newName: name})
  }

  const selected = () => {
    if(selectedRows.length){
      return (
        <ButtonApp title={text.unselect[leng]} handler={() => setSelectedRows([])} />
      )
    }
    else if(!usersFilter.length){
      return (
        <ButtonApp title={text.selectAll[leng]} handler={() => {}} disabled={true} />
      )
    }
    return (
      <ButtonApp title={text.selectAll[leng]} handler={handlers.setSelectedHandler} />
    )
  }
  const renameButAndInput = () => {
    if(rename){
      return (
        <TextInputApp placeholder={activGroup.name} value={newGroupName} handler={setNewGroupName}/>
      )
    }
    return (
      <TextApp title={`${text.group[leng]}: `} text={`${activGroup.name} (${activGroup.group.length})`} />
    )
  }
  const renameButAndInput1 = () => {
    if(rename){
      return (
        <Grid>
          <Grid.Col span={6}>
            <ButtonApp title={text.saveName[leng]} handler={handlers.saveNewGroupName} disabled={!newGroupName}/>
          </Grid.Col>
          <Grid.Col span={6}>
            <ButtonApp title={text.cancel[leng]} handler={handlers.cancelNewGroupName} />
          </Grid.Col>
        
        </Grid>
      )
    }
    return (
      <ButtonApp title={text.rename[leng]} handler={() => setRename(true)} />
    )
  }
  const groupSettings = () => {
    if(typeof activGroup['group'] !== 'undefined'){
      return (
        <>
        <Grid align="center" style={{marginTop: '0.5vmax', marginBottom: '0.5vmax'}}>
          <Grid.Col span={4}>
            {renameButAndInput()}
          </Grid.Col>
          <Grid.Col span={2}>
            {renameButAndInput1()}
          </Grid.Col>
          <Grid.Col span={2}>
            <ButtonApp title={text.deleteGroup[leng]} handler={handlers.deleteGroupHandler} />
          </Grid.Col>
        </Grid>
        <hr></hr>
        </>
      )
    }
  }
  
  const handlers = {
    createGroupHandler: () => createGroup(selectedRows.map(item => item.id)),
    deleteGroupHandler: () => {
                  deleteGroup(activGroup)
                  setActivGroup([])
    },
    saveNewGroupName: () => {
                  renameGroup(activGroup, newGroupName)
                  setRename(false)
                  setActivGroup([])
    },
    cancelNewGroupName: () => {
                  setRename(false)
                  setNewGroupName('')
    },
    setSelectedHandler: () => {
                  const mes = []
                  for(let i of usersFilter){
                    mes.push({id: i.id, username: i.username, status: i.activBot})
                  }
                  setSelectedRows(mes)
    }
  }

 
  if(users && status && screens.length && text && leng){
    return (
      <div style={{width: '100%', marginTop: '0.5vmax', marginBottom: '3vmax', marginLeft: '0.5vmax', marginRight: '0.5vmax'}}>
        <Grid align="center">
            <Grid.Col span={2}>
              <ButtonApp title={text.back[leng]} handler={() => navigate(`/main`)}  color='grey'/>
            </Grid.Col>
            <Grid.Col span={3}>
              <Center>
                <TextApp title={`${text.monit[leng]}: `} text={botName} />
              </Center>
            </Grid.Col>
            <Grid.Col span={3.5}>
              <Center>
                <Switch
                label={text.onlyActiv[leng]}
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
                <TextApp title='' text={`${usersFilter.length} / ${users.length}`} /> 
              </Center>
            </Grid.Col>
            <Grid.Col span={2}>
              <TextInputApp placeholder={text.filter[leng]} value={filter} handler={setFilter}/>
            </Grid.Col>
          </Grid>

        <hr style={{marginTop: '0.5vmax'}}></hr>

        <Grid style={{marginTop: '0.5vmax', marginBottom: '0.5vmax'}}>
          <Grid.Col span={2}>
            {selected()}
          </Grid.Col>
          <Grid.Col span={2}>
            <GroupListMenu text={text} leng={leng} deleteGroup={deleteGroup} groups={groups} setActivGroup={setActivGroup} activGroup={activGroup}/>
          </Grid.Col>
          <Grid.Col span={2}>
            <ButtonApp title={`${text.createGroup[leng]} (${selectedRows.length})`} handler={handlers.createGroupHandler} disabled={!selectedRows.length}/>
          </Grid.Col>
          <Grid.Col span={2}>
            <ModalSendMessageGroup text1={text} leng={leng} selectedRows={selectedRows} sendContentToUser={sendContentToUser} content={content} screens={screens} sendScreenToUser={sendScreenToUser} sendTextToUser={sendTextToUser}/>
          </Grid.Col>
          <Grid.Col span={2}>
            <ButtonApp title={text.createTask[leng]} handler={()=> {}} disabled={true}/>
          </Grid.Col>
          <Grid.Col span={2}>
            <ButtonApp title={`${text.download[leng]} XLS`} handler={()=> {}} disabled={true}/>
          </Grid.Col>
        </Grid>

        {/* <hr></hr> */}

        {groupSettings()}
        <UserList text={text} leng={leng} setSelectedRows={setSelectedRows} selectedRows={selectedRows} content={content} data={usersFilter} screens={screens} sendScreenToUser={sendScreenToUser} sendTextToUser={sendTextToUser} sendContentToUser={sendContentToUser}/>
      </div>
    )
  }
  else{
    return (
      <div style={{marginTop: '5vmax'}}>Loading...</div>
    )
  }

}

