import React, { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Text, Group, Switch, Grid, Spoiler, Tooltip, TextInput, Autocomplete, Image, Select } from '@mantine/core'
import { ButtonApp } from '../../comps/ButtonApp.tsx'

export function ModalCreateScreen({addContentItem, content, deleteContentItem, editScreenName, screenForAnswer, updateVariable, screens, editButtons, clearScreen, protectScrreen, editScreen, modalTitle, screen, sendMeScreen}) {

  const [opened, { open, close }] = useDisclosure(false)
  const [checked, setChecked] = useState(screen.protect)
  const [editButtonsMode, setEditButtonsMode] = useState(false)
  const [buttons, setButtons] = useState(screen.buttons)
  const [newBut, setNewBut] = useState({text: '', to: '', action: ''})
  const [greate, setGreate] = useState('')
  const [controlCheck, setControlCheck] = useState(true)
  const [variable, setVariable] = useState('')
  const [screenIfAnswer, setScreenIfAnswer] = useState('')
  const [screenName, setScreenName] = useState(screen.name)
  const [modeEditName, setModeEditName] = useState(false)
  const [exContent, setExContent] = useState('')
  

  const addOrDeleteButton = (but: object, obj: any) => {
    if(but['to'] === 'addNewBut'){
      if(but['action'] === 'start'){
        buttons.splice(0, 0, [obj])
      }
      else if(but['action'] === 'end'){
        buttons.splice(buttons.length, 0, [obj])
      }
      else{
        buttons[but['action'].split('-')[0]].splice(but['action'].split('-')[1], 0, obj)
      }
    }
    else{
      console.log(but['action'].split('-')[0], but['action'].split('-')[1])
      if(buttons[but['action'].split('-')[0]].length === 1){
        buttons.splice(but['action'].split('-')[0], 1)
      }
      else{
        buttons[but['action'].split('-')[0]].splice(but['action'].split('-')[1], 1)
      }
    }
    setButtons(JSON.parse(JSON.stringify(buttons)))
  }

  const textSize = () => {
    if(screen.text && screen.text.length > 200){
      return (
        <Spoiler maxHeight={30} showLabel="Show more" hideLabel="Hide"><Text c="dimmed" fz="md">
          Text: {screen.text}
        </Text></Spoiler>
      )
    }
    return (
      <Text c="dimmed" fz="md">
          Text: {screen.text}
      </Text>
    )
  }

  const saveVarButton = () => {
    if(variable !== screen.variable && variable !== ''){
      return(
        <Button style={{marginTop: '1vmax'}} variant="default" size="xs"
          onClick={() => {
            updateVariable(screen._id, variable)
            setVariable('')
          }}>
          Save variable
        </Button>
      )
    }
    else if(screen.variable){
      return (
        <>
       <Autocomplete
          description='Screen if recived answer'
          style={{marginTop: '0.5vmax'}}
          placeholder={screens.find(item => item._id === screen.ansScreen) ? screens.find(item => item._id === screen.ansScreen)['name'] : 'not set'}
          data={screens.map(item => item.name + ' ' + item._id)}
          value={screenIfAnswer}
          onChange={(event) => {
              setScreenIfAnswer(event)
              console.log(event.split(' ')[event.split(' ').length - 1])
              screenForAnswer(screen._id, event.split(' ')[event.split(' ').length - 1])
            }
          }
        />
        <Button style={{marginTop: '1vmax'}} variant="default" size="xs"
        onClick={() => {
          updateVariable(screen._id, '')
          screenForAnswer(screen._id, '')
          setVariable('')
        }}>
        Delete variable "{screen.variable}"
      </Button>
        </>
      )
    }
  }

  const keyboard = () => {

    function isUrlValid(url){
      try {
        new URL(url)
         return false
      }
      catch(e){
        return true
      }
    }
    
    const toolTipText = (text, name) => {
      if(text === '➕') return 'Add button'
      return 'Delete ' + name.name
    }

    const showSaveKeyboard = () => {
      if(!controlCheck){
        return (
          <Button style={{marginTop: '2vmax'}} variant="default" size="xs"
              onClick={() => {
                editButtons(screen._id, buttons)
                setControlCheck(true)
              }}>
              Save keyboard
            </Button>
        )
      }
    }

    if(editButtonsMode){
      const timeButtons = JSON.parse(JSON.stringify(buttons))

      for(let i of timeButtons){
        for(let x of i){
          x.action = `${timeButtons.indexOf(i)}-${i.indexOf(x)}`
        }
        i.push({text: '➕', to: 'addNewBut', action: `${timeButtons.indexOf(i)}-${i.length}`})
      }
      if(timeButtons.length === 0){
        timeButtons.push([{text: '➕', to: 'addNewBut', action: `end`}])
      }
      else{
        timeButtons.unshift([{text: '➕', to: 'addNewBut', action: 'start'}])
        timeButtons.push([{text: '➕', to: 'addNewBut', action: `end`}])
      }

      const disabledButton = (but) => {
        if(but.to === 'addNewBut'){
          if(newBut.text === '' || newBut.to === '' || newBut.action === ''){
            return true
          }
          if(newBut.action === 'url'){
            console.log(newBut.to, isUrlValid(newBut.to))
              return isUrlValid(newBut.to)
          }
          return false
        }
        return false
      }

      const creatingButtonName = () => {
        return (
          <TextInput
                description='Create new button'
                placeholder="button name"
                value={newBut.text}
                onChange={(event) => {
                  setNewBut({...newBut, text: event.currentTarget.value})
                }}
            />
        )
      }

      const creatingButtonTo = () => {
        if(newBut.text){
          return (
            <Autocomplete
              label="Link to your screen or internet link"
              placeholder="target"
              data={screens.map(item => item.name + ' ' + item._id)}
              value={greate}
              onChange={(event) => {
                const check = event.split(' ')
                if(screens.map(item => item._id).includes(check[check.length - 1])){
                  setNewBut({...newBut, to: check[check.length - 1], action: 'callback'})
                  check.splice(check.length - 1, 1)
                  setGreate(check.join(' ') + ' (your screen)')
                }
                else{
                  setNewBut({...newBut, to: event, action: 'url'})
                  setGreate(event)
                }
              }}
            />
          )
        }
      }

      return (
        <div style={{marginTop: '1vmax'}}>
        <div style={{width: '100%', marginTop: '2vmax', marginBottom: '2vmax'}}>
              {creatingButtonName()}
              <div style={{marginTop: '1vmax'}}>
                {creatingButtonTo()}
              </div>
            </div>
          {timeButtons.map((item, index) => 
            <Grid key={index}>
              {item.map((but, index) => 
              <Grid.Col span={12 / item.length} key={index}>
                <Tooltip label={toolTipText(but.text, (screens.find(item => item._id === but.to)))}>
                  <Button variant="outline" fullWidth
                  disabled={disabledButton(but)}
                  onClick={() => {
                    addOrDeleteButton(but, {text: newBut.text, to: newBut.to, action: newBut.action})
                    setNewBut({text: '', to: '', action: ''})
                    setGreate('')
                    setControlCheck(false)
                  }}>
                    {but.text}
                  </Button>
                </Tooltip>
              </Grid.Col>)}
            </Grid>)}

            {showSaveKeyboard()}

        </div>
      )
    }
    return (
      <div style={{marginTop: '1vmax'}}>
          {buttons.map((item, index) => 
            <Grid key={index}>
              {item.map((but, index) => 
              <Grid.Col span={12 / item.length} key={index}>
                <Tooltip label={'to: ' + (screens.find(item => item._id === but.to).name)}>
                  <Button variant="outline" fullWidth
                    onClick={() => {
                      if(but.action === 'callback'){
                        sendMeScreen(but.to)
                      }
                      
                    }}>
                    {but.text}
                  </Button>
                </Tooltip>
              </Grid.Col>)}
            </Grid>)}

            {showSaveKeyboard()}

        </div>
    )
  }

  const nameForEditScreen = () => {
    return screens.find(item => item.name.toLowerCase() === screenName.toLowerCase())
  }

  const blockEditStartScreen = () => {
    if(['Start screen', 'Error screen'].includes(screen.name)) return true
    return false
  }

  const editNameScreen = () => {
    if(!modeEditName){
      return (
        <Group justify="space-between" mt="md" grow>
          <Text fz="xl">{screen.name}</Text>
          <div>
            <Button style={{marginLeft: '1vmax'}} variant="default" size="xs"
              disabled={blockEditStartScreen()}
              onClick={() => {
                setModeEditName(true)
              }}>
              Edit name
            </Button>
            <Button style={{marginLeft: '1vmax'}} variant="default" size="xs"
              onClick={() => {
                sendMeScreen(screen._id)
              }}>
              Send me
            </Button>
            <Button style={{marginLeft: '1vmax'}} color='red' size="xs"
              onClick={() => {
                clearScreen(screen._id)
                setButtons([])
              }}>
              Clear screen
            </Button>
          </div>
        </Group>
      )
    }
    return (
      <Group justify="space-between" mt="md" grow>
        <TextInput
          size="xs"
          placeholder={screen.name}
          value={screenName}
          onChange={(event) => {
            setScreenName(event.currentTarget.value)
          }}
        />
        <div>
          <Button style={{marginLeft: '1vmax'}} variant="default" size="xs"
            disabled={nameForEditScreen()}
            onClick={() => {
              editScreenName(screen._id, screenName)
              setModeEditName(false)
            }}>
            Save new name
          </Button>
          <Button style={{marginLeft: '1vmax'}} variant="default" size="xs"
              onClick={() => {
                setModeEditName(false)
              }}>
            Cancel
          </Button>
        </div>
      </Group>
    )

  }

  const imageOrVide = (item) => {
    if(item.type === 'video'){
      return (
        <Button 
          variant="default" 
          // size="xs"
          h='4.5vmax'
          onClick={() => {
            deleteContentItem(screen._id, 'media', item)
          }}>
            video
        </Button>
      )
    }
    else{
      if(item.buffer){
        return (
          <Image
            src={`data:image/jpeg;base64,${item.buffer}`}
            radius="sm"
            h='4.5vmax'
            w="auto"
            onClick={() => {
              deleteContentItem(screen._id, 'media', item)
            }} 
          />
        )
      }
      return (
        <Button 
          variant="default" 
          w='auto'
          h='4.5vmax'
          onClick={() => {
            deleteContentItem(screen._id, 'media', item)
          }}>
            photo
        </Button>
      )
    }
    
    
  }

  return (
    <>
      <Modal size={'65vmax'} opened={opened} 
        onClose={() => {
            editScreen('')
            setTimeout(() => {close()}, )
            }} 
        title={modalTitle}
      >
          {editNameScreen()}

        <hr style={{marginTop: '0.7vmax', marginBottom: '1.3vmax'}}></hr>

        <Switch
            style={{marginTop: '1.5vmax', marginBottom: '1.5vmax'}}
            label="Protect content"
            radius="lg"
            color='red'
            checked={checked}
            onChange={(event) => {
              setChecked(event.currentTarget.checked)
              protectScrreen(screen._id, event.currentTarget.checked)
        }}/>

        <table>
        <tbody>
          <tr>
            <td>
              <Text c="dimmed" fz="md">
                Media: 
                </Text>
                {/* <hr style={{marginTop: '0.5vmax'}}></hr> */}
                </td>
            <td>
              <Group gap="xs" style={{marginLeft: '1vmax'}} >
                  {screen.media.map((item, index) =>
                  <Tooltip label={item.tx ? item.tx + ' delete' : 'noname delete'} key={index}>
                    {imageOrVide(item)}
                </Tooltip>)}
              </Group>
            </td>
          </tr>
          <tr>
            <td><Text c="dimmed" fz="md">
              Documents:
              </Text>
                {/* <hr style={{marginTop: '0.5vmax'}}></hr> */}
                </td>
            <td>
            <Group gap="xs" style={{marginLeft: '1vmax'}} >
              {screen.document.map((item, index) =>
              <Tooltip label={item.tx ? item.tx + ' delete' : 'noname delete'} key={index}>
                <Button variant="default" h='4.5vmax' w='auto'
                    onClick={() => {
                      deleteContentItem(screen._id, 'document', item)
                    }}>
                    file
                </Button>
              </Tooltip> )}
              </Group>
            </td>
          </tr>
          <tr>
            <td><Text c="dimmed" fz="md">
              Audio:
              </Text>
                {/* <hr style={{marginTop: '0.5vmax'}}></hr> */}
                </td>
            <td>
            <Group gap="xs" style={{marginLeft: '1vmax'}} >
              {screen.audio.map((item, index) => 
              <Tooltip label={item.tx ? item.tx + ' delete' : 'noname delete'} key={index}>
                <Button variant="default" h='4.5vmax' w='auto'
                    onClick={() => {
                      deleteContentItem(screen._id, 'audio', item)
                    }}>
                    audio
                </Button>
              </Tooltip>)}
              </Group>
            </td>
          </tr>
        </tbody>
        </table>

        {textSize()}
        <hr style={{marginTop: '0.5vmax', marginBottom: '1vmax'}}></hr>
        <Grid align='center'>
          <Grid.Col span={2}>
            <ButtonApp title='Add existing content' disabled={!exContent} handler={() => {
              addContentItem(screen._id, exContent)
              // setExContent('')
              }} />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              size='xs'
              clearable
              searchable
              data={
                content.map((item, index)=> ({label: (item.tx ? item.tx : 'noname') + ' ( ' + item.type + ' )', value: index.toString(), data: item}))
              }
              // value={exContent}
              onChange={(_value, option) => {
                console.log(_value)
                console.log(option)
                if(option) setExContent(option['data'])
                else setExContent('')
              }}
            />
          </Grid.Col>
        </Grid>
        
        


        <div style={{marginTop: '3vmax'}} >
          <TextInput
                description='Save the answer on this screen to a variable'
                placeholder={screen.variable ? screen.variable : 'not set'}
                value={variable}
                onChange={(event) => {
                  setVariable(event.currentTarget.value)
                }}
          />
          {saveVarButton()}
          
          <Switch
            style={{marginTop: '2.5vmax', marginBottom: '1.5vmax'}}
            label="Edit buttons mode"
            radius="lg"
            color='red'
            checked={editButtonsMode}
            onChange={(event) => {
              setEditButtonsMode(event.currentTarget.checked)
              if(!event.currentTarget.checked) setButtons(buttons)
            }}
          />
        </div>
        
        {keyboard()}

      </Modal>

      <Button variant="default" size="xs"
        onClick={() => {
            editScreen(screen._id)
            open()
            }}>
        Edit
      </Button>
    </>
  )
}