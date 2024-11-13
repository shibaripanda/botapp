import { Button, Paper, Text, TextInput, Grid } from '@mantine/core'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function BotItem({bot, deleteBot, offBot, onBot}) {

  const [deleteValue, setDeleteValue] = useState('')
  const navigate = useNavigate()

  const botStatus = (status) => {
    if(status) return '✅'
    return '❌' 
  }
  const deleteButton = () => {
    if(deleteValue === bot.name) return false
    return true
  }
  const onOffButton = () => {
    if(bot.status){
      return (
        <Button variant="default" size="xs" fullWidth
        onClick={() => {
          offBot(bot._id)
        }}>
          OFF
        </Button>
      )
    }
    return (
      <Button variant="default" size="xs" fullWidth
      onClick={() => {
        onBot(bot._id)
      }}>
          ON
      </Button>
    )
  }
  const contentMode = (mode) => {
    if(mode === 'addContent'){
      return 'ON ⚠️'
    }
    return 'OFF'
  }

  return (
    <Paper withBorder p="lg" radius="md" shadow="md">

      <Grid justify="space-between" style={{marginBottom: '1.5vmax'}}>
        <Grid.Col span={6}>
          <Text fz="md" fw={500}>
            {bot.name} (@{bot.username})
          </Text>
        </Grid.Col>
        <Grid.Col span={4}>
          {/* Status: {botStatus(bot.status)} */}
        </Grid.Col>
        <Grid.Col span={2}>
          Status {botStatus(bot.status)}
        </Grid.Col>
      </Grid>

      <Text c="dimmed" fz="xs">
        Created: {new Date(bot.createdAt).toLocaleDateString()}
      </Text>
      <Text c="dimmed" fz="xs">
        id: {bot._id}
      </Text>
      <Text c="dimmed" fz="xs">
        Add-content mode: {contentMode(bot.mode)}
      </Text>

      <Grid style={{marginTop: '1.5vmax'}}>
        <Grid.Col span={4.5}>
          <Button color="green" size="xs" fullWidth
                    disabled={!bot.status}
                    onClick={() => {
                      navigate(`/monit/${bot._id}/${bot.name} (@${bot.username})`)
                    }}>
                    Monitor
                  </Button>
        </Grid.Col>
        <Grid.Col span={2.5}>
          <Button variant="default" size="xs" fullWidth
                    disabled={!bot.status} 
                    onClick={() => {
                      navigate(`/content/${bot._id}/${bot.name} (@${bot.username})`)
                    }}>
                    Content
                  </Button>
        </Grid.Col>
        <Grid.Col span={2.5}>
          <Button variant="default" size="xs" fullWidth
                    // disabled={true}
                    disabled={!bot.status} 
                    onClick={() => {
                      navigate(`/event/${bot._id}/${bot.name} (@${bot.username})`)
                    }}>
                    Events
                  </Button>
        </Grid.Col>
        <Grid.Col span={2.5}>
          <Button variant="default" size="xs" fullWidth
                    disabled={!bot.status}
                    onClick={() => {
                      navigate(`/botedit/${bot._id}`)
                    }}>
                    Constructor
                  </Button>
        </Grid.Col>
      </Grid>

      <hr  style={{marginTop: '1.5vmax'}}></hr>

      <Grid style={{marginTop: '1vmax'}}>
        <Grid.Col span={2.5}></Grid.Col>
        <Grid.Col span={2.5}></Grid.Col>
        <Grid.Col span={2}>
          {onOffButton()}
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
                      size="xs"
                      placeholder='Text bot`s name for delete'
                      value={deleteValue}
                      onChange={(event) => {
                        setDeleteValue(event.currentTarget.value)
                      }}
                      />
        </Grid.Col>
        <Grid.Col span={2}>
          <Button fullWidth
                  disabled={deleteButton()}
                  color='red'
                  size="xs"
                  onClick={() => {
                    deleteBot(bot._id)
                    setDeleteValue('')
                  }}
                  >
                    Delete
                  </Button>
        </Grid.Col>
      </Grid>

    </Paper>
  );
}