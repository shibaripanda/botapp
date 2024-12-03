import React from 'react'
import { Table } from '@mantine/core'


export function DayTable({day}) {

    console.log(day)

  const rows = day.slots.map((row) => {

    return (
      <Table.Tr key={row.title}>
        <Table.Td>
            {row.startTime}
        </Table.Td>
        <Table.Td>
            {row.clients.length} / {row.maxClients}  
        </Table.Td>
        {/* <Table.Td>
            {row.clients.length}
        </Table.Td> */}
        <Table.Td>
            {row.clients.map(item => item.user).join(', ')}
        </Table.Td>
      </Table.Tr>
    )
  })

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="xs"  withTableBorder withRowBorders={false} striped withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th width={'10%'}>{new Date(day.day).getDate() + '.' + (new Date(day.day).getMonth() + 1) + '.' + new Date(day.day).getFullYear()}</Table.Th>
            <Table.Th width={'10%'}>Clients: {day.slots.reduce((acc, item) => acc + item.clients.length, 0)} / {day.slots.reduce((acc, item) => acc + item.maxClients, 0)}</Table.Th>
            {/* <Table.Th width={'10%'}>Clients: {day.slots.reduce((acc, item) => acc + item.clients.length, 0)}</Table.Th> */}
            <Table.Th>Clients</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}