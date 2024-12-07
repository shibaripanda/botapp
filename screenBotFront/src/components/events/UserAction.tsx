import { Menu, Button, Anchor, Text } from '@mantine/core'
import React, { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { ModalSendMessageEvent } from './ModalSendMessageEvent.tsx'

export function UserAction({sendTextToUser, text, leng, user, indexDay, indexSlot, deleteUserRegistration}) {

    const [opened, setOpened] = useState(false)
    const [openedModal, { open, close }] = useDisclosure(false)
    
    const userInfo = (user) => {
        if(user.userInfo){
          if(user.userInfo.username){
            
            if(user.userInfo.first_name){
              const text = user.userInfo.first_name + ' (@' + user.userInfo.username + ')'
              return text
            }
            else{
              return '@' + user.userInfo.username
            }
          }
        }
        else{
          return 'user' + user.user
        }
    }

    const directMessage = (user) => {
        if(user.userInfo && user.userInfo.username){
            const link = `https://t.me/${user.userInfo.username}`
            return (
                <Menu.Item key={1}>
                    <Anchor size='sm' href={link} target="_blank">Open telegram dialogue</Anchor>
                </Menu.Item>
            )
        } 
    }
    const botMessage = () => {
        return (
            <Menu.Item key={2} onClick={() => open()}>
                <Anchor size='sm'>
                    {text.sendMes[leng]}
                </Anchor>
            </Menu.Item>
        )
    }
    const deleteRegistration = (user) => {
        return (
            <Menu.Item key={3}>
                <Anchor size='sm' onClick={() => {
                    deleteUserRegistration(indexDay, indexSlot, user)
                }}>
                    <Text c={'red'}>Cancel registration</Text>
                </Anchor>
            </Menu.Item>
        )
    }

    return (
        <>
            <Menu shadow="md" width={200} opened={opened} onChange={setOpened} withArrow>
                <Menu.Target>
                    <Button variant="default" size="xs" fullWidth>
                        {userInfo(user)}
                    </Button>
                </Menu.Target>
                <Menu.Dropdown>
                    {[directMessage(user), botMessage(), deleteRegistration(user)]}
                </Menu.Dropdown>
            </Menu>
            <ModalSendMessageEvent 
                text1={text} 
                leng={leng} 
                userId={user.user} 
                username={userInfo(user)} 
                sendTextToUser={sendTextToUser} 
                opened={openedModal}
                close={close}
            />
        </>
    )
}