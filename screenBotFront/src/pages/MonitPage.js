
import '@mantine/core/styles.css'
import React, { useEffect, useMemo, useState } from 'react'
import '../styles/App.css'
import { useConnectSocket } from '../socket/hooks/useConnectSocket.ts'
import { fix } from '../fix/fix.js'
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
      window.location.assign(fix.appLink)
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
        <ButtonApp title={`Unselect all`} handler={() => setSelectedRows([])} />
      )
    }
    else if(!usersFilter.length){
      return (
        <ButtonApp title={`Select all`} handler={() => {}} disabled={true} />
      )
    }
    return (
      <ButtonApp title={`Select all`} handler={handlers.setSelectedHandler} />
    )
  }
  const renameButAndInput = () => {
    if(rename){
      return (
        <TextInputApp placeholder={activGroup.name} value={newGroupName} handler={setNewGroupName}/>
      )
    }
    return (
      <TextApp title='Group: ' text={`${activGroup.name} (${activGroup.group.length})`} />
    )
  }
  const renameButAndInput1 = () => {
    if(rename){
      return (
        <Grid>
          <Grid.Col span={6}>
            <ButtonApp title={`Save`} handler={handlers.saveNewGroupName} disabled={!newGroupName}/>
          </Grid.Col>
          <Grid.Col span={6}>
            <ButtonApp title={`Cancel`} handler={handlers.cancelNewGroupName} />
          </Grid.Col>
        
        </Grid>
      )
    }
    return (
      <ButtonApp title={`Rename group`} handler={() => setRename(true)} />
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
            <ButtonApp title={`Delete group`} handler={handlers.deleteGroupHandler} />
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

 
  if(users && status && screens.length){
    return (
      <div style={{width: '100%', marginTop: '0.5vmax', marginBottom: '3vmax', marginLeft: '0.5vmax', marginRight: '0.5vmax'}}>
        <Grid align="center">
            <Grid.Col span={2}>
              <ButtonApp title='Back to all bots' handler={() => navigate(`/main`)}  color='grey'/>
            </Grid.Col>
            <Grid.Col span={3}>
              <Center>
                <TextApp title='Users: ' text={botName} />
              </Center>
            </Grid.Col>
            <Grid.Col span={3.5}>
              <Center>
                <Switch
                label="Only active users"
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
              <TextInputApp placeholder='Users filter' value={filter} handler={setFilter}/>
            </Grid.Col>
          </Grid>

        <hr style={{marginTop: '0.5vmax'}}></hr>

        <Grid style={{marginTop: '0.5vmax', marginBottom: '0.5vmax'}}>
          <Grid.Col span={2}>
            {selected()}
          </Grid.Col>
          <Grid.Col span={2}>
            <GroupListMenu deleteGroup={deleteGroup} groups={groups} setActivGroup={setActivGroup} activGroup={activGroup}/>
          </Grid.Col>
          <Grid.Col span={2}>
            <ButtonApp title={`Greate group (${selectedRows.length})`} handler={handlers.createGroupHandler} disabled={!selectedRows.length}/>
          </Grid.Col>
          <Grid.Col span={2}>
            <ModalSendMessageGroup selectedRows={selectedRows} sendContentToUser={sendContentToUser} content={content} screens={screens} sendScreenToUser={sendScreenToUser} sendTextToUser={sendTextToUser}/>
          </Grid.Col>
          <Grid.Col span={2}>
            <ButtonApp title={`Create task`} handler={()=> {}} disabled={true}/>
          </Grid.Col>
          <Grid.Col span={2}>
            <ButtonApp title={`Download XLS`} handler={()=> {}} disabled={true}/>
          </Grid.Col>
        </Grid>

        {/* <hr></hr> */}

        {groupSettings()}
        <UserList setSelectedRows={setSelectedRows} selectedRows={selectedRows} content={content} data={usersFilter} screens={screens} sendScreenToUser={sendScreenToUser} sendTextToUser={sendTextToUser} sendContentToUser={sendContentToUser}/>
      </div>
    )
  }
  else{
    return (
      <div style={{marginTop: '5vmax'}}>Loading...</div>
    )
  }

}

