import { Container, Title, Group, Text, List, ThemeIcon, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import classes from './HelloScreen.css';
import React from 'react';
import { TelegramVidget } from '../../modules/TelegramVidget';

export function HelloScreen(props) {
  console.log(props)
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            {props.text.constructor[props.leng]}
          </Title>
          <Text c="dimmed" mt="md">
            {props.text.createBot[props.leng]}
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </ThemeIcon>
            }
          >
            {/* <List.Item>
              <b>TypeScript based</b> – build type safe applications, all components and hooks
              export types
            </List.Item>
            <List.Item>
              <b>Free and open source</b> – all packages have MIT license, you can use Mantine in
              any project
            </List.Item>
            <List.Item>
              <b>No annoying focus ring</b> – focus ring will appear only when user navigates with
              keyboard
            </List.Item> */}
          </List>

          <Group mt={30}>
            <TelegramVidget/>
          </Group>
        </div>
      </div>
    </Container>
  );
}