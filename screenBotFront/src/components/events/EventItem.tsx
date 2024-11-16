import { Paper, Text, Group, Grid } from '@mantine/core';
import React from 'react'
import { ButtonApp } from '../comps/ButtonApp.tsx';
import { ModalCreateEventPermament } from './ModalCreateEventPermament.tsx';

export function EventItem({text, leng, oneEvent, deleteEvent, updateEvent}){

  const buttonsSection = [
    <ModalCreateEventPermament text={text} leng={leng} oneEvent={oneEvent} updateEvent={updateEvent} />,
    <ButtonApp title={text.delete[leng]} handler={() => deleteEvent(oneEvent)} disabled={false} color={'red'}/>
  ]

  return (
    <Paper withBorder p="lg" radius="md" shadow="md">
      <Group justify="space-between" mb="xs">
        <Text>{oneEvent.name}</Text>
      </Group>

      <Grid>
        {buttonsSection.map((item, index) => <Grid.Col key={index} span={12 / buttonsSection.length}>{item}</Grid.Col>)}
      </Grid>

    </Paper>
  )
}