import { Button, Paper, Text, TextInput, Grid } from '@mantine/core'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function BotItem({bot, deleteBot, offBot, onBot, text, leng}) {

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
          {text.off[leng]}
        </Button>
      )
    }
    return (
      <Button variant="default" size="xs" fullWidth
      onClick={() => {
        onBot(bot._id)
      }}>
          {text.on[leng]}
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
        {text.status[leng]} {botStatus(bot.status)}
        </Grid.Col>
      </Grid>

      <Text c="dimmed" fz="xs">
        {text.created[leng]}: {new Date(bot.createdAt).toLocaleDateString()}
      </Text>
      <Text c="dimmed" fz="xs">
        id: {bot._id}
      </Text>
      <Text c="dimmed" fz="xs">
        {text.addContentMode[leng]}: {contentMode(bot.mode)}
      </Text>

      <Grid style={{marginTop: '1.5vmax'}}>
        <Grid.Col span={4.5}>
          <Button color="green" size="xs" fullWidth
                    disabled={!bot.status}
                    onClick={() => {
                      navigate(`/monit/${bot._id}/${bot.name} (@${bot.username})`)
                    }}>
                    {text.monit[leng]}
                  </Button>
        </Grid.Col>
        <Grid.Col span={2.5}>
          <Button variant="default" size="xs" fullWidth
                    disabled={!bot.status} 
                    onClick={() => {
                      navigate(`/content/${bot._id}/${bot.name} (@${bot.username})`)
                    }}>
                    {text.content[leng]}
                  </Button>
        </Grid.Col>
        <Grid.Col span={2.5}>
          <Button variant="default" size="xs" fullWidth
                    // disabled={true}
                    disabled={!bot.status} 
                    onClick={() => {
                      navigate(`/event/${bot._id}/${bot.name} (@${bot.username})`)
                    }}>
                    {text.events[leng]}
                  </Button>
        </Grid.Col>
        <Grid.Col span={2.5}>
          <Button variant="default" size="xs" fullWidth
                    disabled={!bot.status}
                    onClick={() => {
                      navigate(`/botedit/${bot._id}`)
                    }}>
                    {text.constr[leng]}
                  </Button>
        </Grid.Col>
      </Grid>

      <hr  style={{marginTop: '1.5vmax'}}></hr>

      <Grid style={{marginTop: '1vmax'}}>
        <Grid.Col span={2}></Grid.Col>
        <Grid.Col span={2.5}></Grid.Col>
        <Grid.Col span={2.5}>
          {onOffButton()}
        </Grid.Col>
        <Grid.Col span={2.5}>
          <TextInput
                      size="xs"
                      placeholder={text.botName[leng]} 
                      value={deleteValue}
                      onChange={(event) => {
                        setDeleteValue(event.currentTarget.value)
                      }}
                      />
        </Grid.Col>
        <Grid.Col span={2.5}>
          <Button fullWidth
                  disabled={deleteButton()}
                  color='red'
                  size="xs"
                  onClick={() => {
                    deleteBot(bot._id)
                    setDeleteValue('')
                  }}
                  >
                    {text.delete[leng]}
                  </Button>
        </Grid.Col>
      </Grid>

    </Paper>
  );
}