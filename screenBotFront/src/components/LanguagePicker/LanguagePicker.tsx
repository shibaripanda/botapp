import { useState } from 'react';
import { UnstyledButton, Menu, Group, ScrollArea } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
// import images from './images';
import classes from './LanguagePicker.module.css';
import React from 'react';

export function LanguagePicker(props) {
  const [opened, setOpened] = useState(false)
  const items = props.avLeng.map((item) => (
    <Menu.Item
      onClick={() => props.setLeng(item.index)}
      key={item.index}
    >
      {item.title}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal
    >
      <Menu.Target>
        <ScrollArea>
            <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
            <Group gap="xs">
                <span className={classes.label}>{props.leng}</span>
            </Group>
            <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />
            </UnstyledButton>
        </ScrollArea>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}