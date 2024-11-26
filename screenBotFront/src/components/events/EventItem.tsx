import { Paper, Text, Group, Grid } from '@mantine/core';
import React from 'react'
import { ButtonApp } from '../comps/ButtonApp.tsx';
import { ModalCreateEvent } from './ModalCreateEvent.tsx';

export function EventItem({text, leng, oneEvent, deleteEvent, updateEvent, setEvents}){

  const buttonsSection = [
    <ModalCreateEvent text={text} leng={leng} oneEvent={oneEvent} updateEvent={updateEvent} setEvents={setEvents}/>,
    <ButtonApp title={text.delete[leng]} handler={() => deleteEvent(oneEvent)} disabled={false} color={'red'}/>
  ]

  const buttonsSectionUse = [
    // <ModalCreateEventPermament text={text} leng={leng} oneEvent={oneEvent} updateEvent={updateEvent} />,
    <ButtonApp title={text.open[leng]} handler={() => {}} disabled={false} color={'green'}/>
  ]

  const butSection = () => {
    if(oneEvent.status === 'public'){
      return buttonsSectionUse.map((item, index) => <Grid.Col key={index} span={12 / buttonsSectionUse.length}>{item}</Grid.Col>)
    }
    return buttonsSection.map((item, index) => <Grid.Col key={index} span={12 / buttonsSection.length}>{item}</Grid.Col>)
  }

  const statusInfo = () => {
    if(oneEvent.status === 'new') return text.new[leng]
    else if(oneEvent.status === 'edit') return text.editing[leng]
    else if(oneEvent.status === 'public') return text.published[leng]
    else if(oneEvent.status === 'use') return text.inuse[leng]
  }

  return (
    <Paper withBorder p="lg" radius="md" shadow="md">
      <Group justify="space-between" mb="xs">
        <Text>{oneEvent.name + ' (' + statusInfo() + ')'}</Text>
      </Group>

      <Grid>
        {butSection()}
      </Grid>

    </Paper>
  )
}