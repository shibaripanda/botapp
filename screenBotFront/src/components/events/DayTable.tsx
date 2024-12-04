import React from 'react'
import { Grid, Table } from '@mantine/core'
import { UserAction } from './UserAction.tsx'


export function DayTable({day, deleteUserRegistration, indexDay}) {

  const rows = day.slots.map((slot, index1) => {

    return (
      <Table.Tr key={index1}>
        <Table.Td  width={'10%'}>
            {slot.startTime}
        </Table.Td>
        <Table.Td  width={'10%'}>
            {slot.clients.length} / {slot.maxClients}  
        </Table.Td>
        <Table.Td>
            <Grid>{slot.clients.map((item, index) => <Grid.Col span={2.5}><UserAction key={index} user={item} indexDay={indexDay} indexSlot={index1} deleteUserRegistration={deleteUserRegistration}/></Grid.Col>)}</Grid>
        </Table.Td>
      </Table.Tr>
    )
  })

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="xs"  withTableBorder withRowBorders={false} striped withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{new Date(day.day).getDate() + '.' + (new Date(day.day).getMonth() + 1) + '.' + new Date(day.day).getFullYear()}</Table.Th>
            <Table.Th>Clients: {day.slots.reduce((acc, item) => acc + item.clients.length, 0)} / {day.slots.reduce((acc, item) => acc + item.maxClients, 0)}</Table.Th>
            <Table.Th>Clients</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}