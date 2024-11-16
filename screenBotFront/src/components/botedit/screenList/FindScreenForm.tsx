import React from 'react'
import { Button, Grid, Group, Paper, Text, TextInput } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { SpesialListMenu } from '../SpesialListMenu.tsx'

export function FindScreenForm({updateEvent, createEventScreen, events, text, leng, spScreen, setSpScreen, screenFilterLength, bot, screens, createScreen, newScreenName, setNewScreenName, filterScreens, setFilterScreens}) {

    const navigate = useNavigate()

    const activButtonCreateScreen = () => {
        if(newScreenName === '' || screens.map(item => item.name.toLowerCase()).includes(newScreenName.toLowerCase())) return true
        return false
    }

    const activButtonFilter = () => {
        if(filterScreens === '') return true
        return false
    }

    return (
        <Paper withBorder p="lg" radius="md" shadow="md">
            <Group justify="space-between">
                <Button variant="default" size="xs"
                    onClick={() => {
                    navigate(`/main`)
                    }}>
                    {text.back[leng]}
                </Button>
                <Text fw={700}>{text.constr[leng]}: {bot.name + ' (@' + bot.username + ')'}</Text>
            </Group>

            <hr style={{marginBottom: '2vmax', marginTop: '1.2vmax'}}></hr>

            <Grid justify="space-between" align="flex-end" grow>
                <Grid.Col span={12} key={0}>
                    <TextInput
                        size='xs'
                        description={text.createNewScreen[leng]}
                        placeholder={text.newScreenName[leng]}
                        value={newScreenName}
                        onChange={(event) => {
                            setNewScreenName(event.currentTarget.value)
                        }}
                    />
                </Grid.Col>
                <Grid.Col span={6} key={1}>
                    <Button variant="default" fullWidth
                        size='xs' 
                        disabled={activButtonCreateScreen()}
                        onClick={() => {
                            createScreen(newScreenName)
                            setNewScreenName('')
                            }}>
                        {text.createNewScreen[leng]}
                    </Button>
                </Grid.Col>
                <Grid.Col span={6} key={2}>
                    <SpesialListMenu updateEvent={updateEvent} setNewScreenName={setNewScreenName} newScreenName={newScreenName} createEventScreen={createEventScreen} events={events} text={text} leng={leng} spScreen={spScreen} setSpScreen={setSpScreen} activButtonCreateScreen={activButtonCreateScreen}/>
                </Grid.Col>
            </Grid>

            <hr style={{marginBottom: '2vmax', marginTop: '2vmax'}}></hr>

            <Grid justify="space-between" align="flex-end" grow>
                <Grid.Col span={12} key={0}>
                    <TextInput
                        size='xs'
                        description={text.findScreenByName[leng]}
                        placeholder={text.screenName[leng]}
                        value={filterScreens}
                        onChange={(event) => {
                            setFilterScreens(event.currentTarget.value)
                        }}
                    />
                </Grid.Col>
                <Grid.Col span={12} key={1}>
                    <Button variant="default" fullWidth
                        size='xs'
                        disabled={activButtonFilter()}
                        onClick={() => {
                            setFilterScreens('')
                            }}>
                        {text.resetFilter[leng]} ({screenFilterLength}/{screens.length})
                    </Button>
                </Grid.Col>
            </Grid>
        </Paper>
    )

}