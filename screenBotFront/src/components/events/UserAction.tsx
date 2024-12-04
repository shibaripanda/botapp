import { Menu, Button, Anchor, Text } from '@mantine/core';
import React, { useState } from 'react'

export function UserAction({user, indexDay, indexSlot, deleteUserRegistration}) {

    console.log(user)
    const [opened, setOpened] = useState(false)

    const userInfo = (user) => {
        if(user.userInfo){
          console.log(user.userInfo)
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

    const botMessage = (user) => {
        return (
            <Menu.Item key={2}>
                <Anchor size='sm' onClick={() => {
                    console.log('bot message ' + user.user)
                }}>Message via bot</Anchor>
            </Menu.Item>
        )
    }

    const deleteRegistration = (user) => {
        return (
            <Menu.Item key={3}>
                <Anchor size='sm' onClick={() => {
                    console.log('delete')
                    deleteUserRegistration(indexDay, indexSlot, user)
                }}>
                    <Text c={'red'}>Cancel registration</Text>
                </Anchor>
            </Menu.Item>
        )
    }

  return (
    <Menu shadow="md" width={200} opened={opened} onChange={setOpened} withArrow>
        <Menu.Target>
            <Button variant="default" size="xs" fullWidth>
                {userInfo(user)}
            </Button>
        </Menu.Target>
        <Menu.Dropdown>
            {[directMessage(user), botMessage(user), deleteRegistration(user)]}
        </Menu.Dropdown>
    </Menu>
  )
}