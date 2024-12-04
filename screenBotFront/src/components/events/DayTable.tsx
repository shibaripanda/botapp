import React from 'react'
import { Anchor, Table, Tooltip } from '@mantine/core'


export function DayTable({day}) {

  const userInfo = (user) => {
    if(user.userInfo){
      console.log(user.userInfo)
      if(user.userInfo.username){
        const link = `https://t.me/${user.userInfo.username}`
        if(user.userInfo.first_name){
          const text = user.userInfo.first_name + ' (@' + user.userInfo.username + ')'
          return <Tooltip label="Direct message" withArrow><Anchor size='sm' href={link} target="_blank">{text}</Anchor></Tooltip>
        }
        else{
          return <Tooltip label="Direct message" withArrow><Anchor size='sm' href={link} target="_blank">@{user.userInfo.username}</Anchor></Tooltip>
        }
      }
    }
    else{
      return <Tooltip label="Bot message" withArrow><Anchor size='sm' onClick={() => console.log(user.user)}>{'user' + user.user}</Anchor></Tooltip>
    }
  }

  const rows = day.slots.map((row, index) => {

    return (
      <Table.Tr key={index}>
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
            {row.clients.map(item => userInfo(item))}
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