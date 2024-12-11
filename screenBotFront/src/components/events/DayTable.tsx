import React, { useMemo } from 'react'
import { Button, Grid, Group, Table } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { UserAction } from './UserAction.tsx'
import { ModalSendMessageGroupEvent } from './ModalSendMessageGroupEvent.tsx'


export function DayTable({sendTextToUser, text, leng, eventName, createNamedGroup, checked, day, deleteUserRegistration, indexDay}) {

  const [openedModal, { open, close }] = useDisclosure(false)

  const slotsFilter = useMemo(() => {
    if(!checked){
      return day.slots
    }
    return day.slots.filter(item => item.clients.length)
    
    }, [day.slots, checked]
  )

  const rows = slotsFilter.map((slot, index1) => {

    return (
      <Table.Tr key={index1}>
        <Table.Td  width={'10%'}>
            {slot.startTime}
        </Table.Td>
        <Table.Td  width={'10%'}>
            {slot.clients.length} / {slot.maxClients}  
        </Table.Td>
        <Table.Td>
            <Grid>{slot.clients.map((item, index) => <Grid.Col key={index} span={2.5}><UserAction sendTextToUser={sendTextToUser} text={text} leng={leng} key={index} user={item} indexDay={indexDay} indexSlot={index1} deleteUserRegistration={deleteUserRegistration}/></Grid.Col>)}</Grid>
        </Table.Td>
      </Table.Tr>
    )
  })

  const activesForClients = () => {
    if(day.slots.reduce((acc, item) => acc + item.clients.length, 0) === 0){
      return (
        <div>{text.clients[leng]}</div>
      )
    }
    return (
      <Group>
        <Button variant={'default'} size="xs" 
          onClick={() => {
            const time = new Date(day.day).getDate() + '.' + (new Date(day.day).getMonth() + 1) + '.' + new Date(day.day).getFullYear()
            createNamedGroup([...new Set(day.slots.filter(item => item.clients.length).map(item => item.clients).flat().map(item => item.user))], eventName + ' ' + time)
          }}
        >
          {text.createOrRefGroup[leng]}
        </Button>
        <Button variant={'default'} size="xs" onClick={open} disabled={[...new Set(day.slots.filter(item => item.clients.length).map(item => item.clients).flat().map(item => item.user))].length === 1}>
          {text.mesToAll[leng]}
        </Button>
      </Group>
    )
    
  }

  return (
    <>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="xs"  withTableBorder withRowBorders={false} striped withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{new Date(day.day).getDate() + '.' + (new Date(day.day).getMonth() + 1) + '.' + new Date(day.day).getFullYear()}</Table.Th>
              <Table.Th>{text.clients[leng]}: {day.slots.reduce((acc, item) => acc + item.clients.length, 0)} / {day.slots.reduce((acc, item) => acc + item.maxClients, 0)}</Table.Th>
              <Table.Th>{activesForClients()}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <ModalSendMessageGroupEvent 
        text1={text} 
        leng={leng} 
        users={[...new Set(day.slots.filter(item => item.clients.length).map(item => item.clients).flat().map(item => item.user))]}
        sendTextToUser={sendTextToUser} 
        opened={openedModal} 
        close={close}
        />
    </>
  )
}