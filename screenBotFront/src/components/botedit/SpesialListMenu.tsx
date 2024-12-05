import { Menu, Button } from '@mantine/core';
import React, { useState } from 'react'

export function SpesialListMenu({screens, updateEvent, setNewScreenName, newScreenName, createEventScreen, events, text, leng, spScreen, setSpScreen, activButtonCreateScreen}) {


    console.log(events)
    const [opened, setOpened] = useState(false)
    // console.log(screens[0])
    // console.log(screens.map(item => item.idEvent))
    const menuItems = events.filter(item => item.status === 'public' || 'use').filter(item => !screens.map(item => item.idEvent).includes(item.idEvent)).map((item, index) => 
        
            <Menu.Item
                key={index}
                onClick={() => {
                    createEventScreen(newScreenName, item.idEvent)
                    setNewScreenName('')
                    updateEvent(item, {...item, status: 'use'})
                }}>
                {item.name}
            </Menu.Item>)

  return (
    <Menu shadow="md" width={200} opened={opened} onChange={setOpened} withArrow>
        <Menu.Target>
            <Button variant="default" size="xs" fullWidth
            disabled={activButtonCreateScreen()}>
                {text.createScreenEvent[leng]}
            </Button>
        </Menu.Target>
        <Menu.Dropdown>
            {menuItems}
        </Menu.Dropdown>
    </Menu>
  )
}