import { Menu, Button } from '@mantine/core';
import React, { useState } from 'react'

export function SpesialListMenu({spScreen, setSpScreen, activButtonCreateScreen}) {

    const [opened, setOpened] = useState(false)

    const menuItems = ['Sign up for the event'].map((item, index) => 
        
            <Menu.Item
                key={index}
                onClick={() => {
                    setSpScreen(item)
                }}>
                {item}
            </Menu.Item>)

  return (
    <Menu shadow="md" width={200} opened={opened} onChange={setOpened} withArrow>
        <Menu.Target>
            <Button variant="default" size="xs" fullWidth
            disabled={activButtonCreateScreen()}>
                {`Create special screen`}
            </Button>
        </Menu.Target>
        <Menu.Dropdown>
        {/* <Menu.Item
            onClick={() => {
                setActivGroup([])
            }}>
            All users
        </Menu.Item> */}
        {/* <hr></hr> */}
            {menuItems}
        </Menu.Dropdown>
    </Menu>
  )
}