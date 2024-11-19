import React, { useMemo, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Grid, Paper, TextInput, Slider, Text, Checkbox } from '@mantine/core'
import { ButtonApp } from '../comps/ButtonApp.tsx'
import { TimeInput } from '@mantine/dates'
import { DatePicker } from '@mantine/dates'

export function ModalCreateEvent({text, leng, oneEvent, updateEvent}) {

  const [opened, { open, close }] = useDisclosure(false)
  const [editedEvent, setEditedEvent] = useState(structuredClone(oneEvent))
  const [stat, setStat] = useState(0)
  const [dateStartPeriod, setDateStartPeriod] = useState<[Date | null, Date | null]>([null, null])
  const [daysForDelete, setDaysForDelete] = useState<Date[]>([])
  const [daysArrow, setDaysArrow] = useState<Date[]>([])

  const [checked, setChecked] = useState([0 ,1, 2, 3, 4, 5, 6])

  useMemo(() => {
    setEditedEvent(structuredClone(oneEvent))
  }, [oneEvent])
  useMemo(() => {
    
    if(dateStartPeriod[0] && dateStartPeriod[1]){
      console.log('selectDays')
      daysArrow.splice(0, daysArrow.length)
      
      const startTime = dateStartPeriod[0].getTime()
      const endTime = dateStartPeriod[1].getTime()
      const countDays = ((endTime - startTime) / 86400000) + 1

      for(let i = 0; i < countDays; i++){
        const x = startTime + (86400000 * i)
        daysArrow.push(new Date(x))
        setDaysArrow(daysArrow)
      }
      console.log(daysArrow.map(item => item.getDate() + '.' + (item.getMonth() + 1) + '.' + item.getFullYear()))
    }

  }, [dateStartPeriod, daysArrow])
  useMemo(() => {
    console.log(daysForDelete)
  }, [daysForDelete])

  // const red = useMemo((date) => {
  //     console.log(daysForDelete)
  //     console.log(date)
  //     console.log(daysForDelete.includes(date))
  //     return !checked.includes(date.getDay()) || daysForDelete.includes(date)
  //   }, [checked]
  // )

  const handlers = {
    addSlot: () => {
      console.log(stat)
      const clock = editedEvent.slots[editedEvent.slots.length - 1].startTime.split(':')
      let x = Number(clock[1]) + editedEvent.slots[editedEvent.slots.length - 1].duration + editedEvent.slots[editedEvent.slots.length - 1].break
      const upH = Number(clock[0]) + Math.floor(x / 60)
      const upM = x % 60

      const timeToTwoDigits = (digit: number) => {
        if(digit.toString().length === 1){
          return '0' + digit
        }
        return digit
      }
      if(Number(timeToTwoDigits(upH)) < 24){
        editedEvent.slots[editedEvent.slots.length] = structuredClone(editedEvent.slots[editedEvent.slots.length - 1])
        editedEvent.slots[editedEvent.slots.length - 1].startTime = `${timeToTwoDigits(upH)}:${timeToTwoDigits(upM)}`
        setStat(Date.now())
      }
    },
    getTimeNextEvent: () => {
      const clock = editedEvent.slots[editedEvent.slots.length - 1].startTime.split(':')
      let x = Number(clock[1]) + editedEvent.slots[editedEvent.slots.length - 1].duration + editedEvent.slots[editedEvent.slots.length - 1].break
      const upH = Number(clock[0]) + Math.floor(x / 60)
      const upM = x % 60

      const timeToTwoDigits = (digit: number) => {
        if(digit.toString().length === 1){
          return '0' + digit
        }
        return digit
      }
      if(Number(timeToTwoDigits(upH)) < 24){
        return (
          <ButtonApp title={`${text.addSlot[leng]} ${timeToTwoDigits(upH)}:${timeToTwoDigits(upM)}`} handler={handlers.addSlot} />
        )
        // setStat(Date.now())
      }
      return (
        <ButtonApp title={text.addSlot[leng]} disabled={true}/>
      )
      
    },
    openForReg: (item) => {
      if(item.onepForResistration){
        return (
          <ButtonApp
            title={'Close for registration'}
            handler={() => {
              item.onepForResistration = false
              setStat(Date.now())
            }}
        />
        )
      }
      return (
        <ButtonApp
          title={'Open for registration'}
          handler={() => {
            item.onepForResistration = true
            setStat(Date.now())
          }}
      />
      )

    }
  }
  const dayEvents = editedEvent.slots.map((item, index) => 
    <Grid.Col key={index} span={12}>
      <Paper withBorder p="lg" radius="md" shadow="md">
        <Grid align="flex-end">
          <Grid.Col span={3}>
          <TimeInput
            disabled={index !== editedEvent.slots.length - 1 || editedEvent.slots.length !== 1}
            value={item.startTime}
            onChange={(event) => {
              item.startTime = event.currentTarget.value
              setStat(Date.now())
            }}
            size="xs"
            radius="sm"
            label={text.startSlot[leng]}
          />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              disabled={index !== editedEvent.slots.length - 1}
              onChange={(event) => {
                item.duration = Number(event.currentTarget.value)
                setStat(Date.now())
              }}
              value={item.duration}
              size="xs"
              radius="sm"
              label={text.durmin[leng]}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              disabled={index !== editedEvent.slots.length - 1}
              onChange={(event) => {
                item.break = Number(event.currentTarget.value)
                setStat(Date.now())
              }}
              value={item.break}
              size="xs"
              radius="sm"
              label={text.pausmin[leng]}
            />
            <Slider
              disabled={index !== editedEvent.slots.length - 1}
              max={180}
              step={5}
              min={0}
              label={null}
              value={item.break}
              onChange={(event) => {
                item.break = event
                setStat(Date.now())
              }}
              size={2}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <ButtonApp
              title={text.delete[leng]}
              disabled={index !== editedEvent.slots.length - 1 || editedEvent.slots.length === 1}
              handler={() => {
                editedEvent.slots.splice(-1)
                setStat(Date.now())
              }}
            />
          </Grid.Col>
        </Grid>
      </Paper>
    </Grid.Col>
  )
  const filterDays = () => {
    return (
      <Grid>
        {checked.map((item, index) => 
          <Grid.Col span={1.5} key={index}>
              <Checkbox
              label={text[`day${index}`][leng].substring(0, 3)}
              checked={checked.includes(index)}
              onChange={(event) => {
                if(event.currentTarget.checked){
                  checked[index] = index
                }
                else{
                  checked[index] = 9
                }
                setChecked([...checked])
              }}
            />
          </Grid.Col>)}
      </Grid>
    )
  }

  const daySlotsEdition = () => {
    return (

          <Paper withBorder p="lg" radius="md" shadow="md" style={{marginTop: '2vmax', marginBottom: '2vmax'}}>
            <Grid>
              {dayEvents}
              <Grid.Col span={3} style={{marginTop: '1vmax'}}>
                {handlers.getTimeNextEvent()}
              </Grid.Col>
            </Grid>
          </Paper>
    )
  }
  const titleData = () => {
    return (
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            onChange={(event) => {
              editedEvent.name = event.currentTarget.value
              setStat(Date.now())
            }}
            value={editedEvent.name}
            size="xs"
            radius="sm"
            label={text.eventName[leng]}
            style={{marginBottom: '1vmax'}}
          />
          <div>
            {dateStartPeriod[0] ? dateStartPeriod[0].toLocaleDateString() : ''} {' - '}
            {dateStartPeriod[1] ? dateStartPeriod[1].toLocaleDateString() : ''} {' - '}
            ({(dateStartPeriod[0] && dateStartPeriod[1] ? (((dateStartPeriod[1].getTime() - dateStartPeriod[0].getTime()) / 86400000) + 1) : '')})
            </div>
          <hr style={{marginTop: '1vmax', marginBottom: '1vmax'}}></hr>
        </Grid.Col>
      </Grid>
    )
  }
  const excludeDays = (date) => {
    return !checked.includes(date.getDay())
  }
  const excludeDaysReady = (date) => {
    // const check = (day) => {
    //   for(const i of daysArrow){
    //     if(daysForDelete.includes(i)){
    //       return false
    //     }
    //     return true
    //   }
    // }
    console.log(daysForDelete)
    console.log(date)
    console.log(daysForDelete.includes(date))
    return !checked.includes(date.getDay()) || daysArrow.includes(date)
  }
  const dataSelect = () => {
    return (
      <Paper withBorder p="lg" radius="md" shadow="md" style={{marginTop: '2vmax', marginBottom: '2vmax'}}>
        <Text>Выбери дату мероприятия или группу дат для постоянного мероприятия</Text>
        <div style={{marginTop: '1vmax', marginBottom: '1vmax'}}>
          {filterDays()}
        </div>
        <DatePicker
          locale={leng}
          monthsListFormat="MM" 
          size="xs"
          excludeDate={(date) => excludeDays(date)}  
          maxLevel="month" 
          minDate={new Date(Date.now())} 
          hideOutsideDates 
          allowSingleDateInRange 
          type="range"
          numberOfColumns={3} 
          value={dateStartPeriod} 
          onChange={setDateStartPeriod}
        />
      </Paper>
    )
  }
  const dataDeSelect = () => {
    if(dateStartPeriod[0] && dateStartPeriod[1]){
      return (
        <Paper withBorder p="lg" radius="md" shadow="md" style={{marginTop: '2vmax', marginBottom: '2vmax'}}>
          <Text>Выберите даты для исключения (пример: ваши выходные или типо того)</Text>
          <DatePicker
            locale={leng}
            monthsListFormat="MM" 
            size="xs" 
            maxLevel="month"
            hideOutsideDates
            excludeDate={(date) => excludeDays(date)} 
            type="multiple"
            numberOfColumns={3} 
            value={daysForDelete} 
            onChange={setDaysForDelete}
            minDate={dateStartPeriod[0]}
            maxDate={dateStartPeriod[1]}
          />
          <ButtonApp 
                  title={'Сохранить'} 
                  // handler={() => updateEvent(oneEvent, editedEvent)} 
                  // disabled={JSON.stringify(oneEvent) === JSON.stringify(editedEvent)}
                />
        </Paper>
      )
    }
  }
  const readySelect = () => {
    if(dateStartPeriod[0] && dateStartPeriod[1]){
      return (
        <Paper withBorder p="lg" radius="md" shadow="md" style={{marginTop: '2vmax', marginBottom: '2vmax'}}>
          <Text>Детальный редактор дней</Text>
          <DatePicker
            locale={leng}
            monthsListFormat="MM" 
            size="xs" 
            maxLevel="month"
            hideOutsideDates
            excludeDate={(date) => excludeDaysReady(date)} 
            type="multiple"
            numberOfColumns={3} 
            // value={daysForDelete} 
            // onChange={setDaysForDelete}
            minDate={dateStartPeriod[0]}
            maxDate={dateStartPeriod[1]}
          />
          <ButtonApp 
                  title={'Сохранить'} 
                  // handler={() => updateEvent(oneEvent, editedEvent)} 
                  // disabled={JSON.stringify(oneEvent) === JSON.stringify(editedEvent)}
                />
        </Paper>
      )
    }
  }

  return (
    <>
      <Modal size={'65vmax'} opened={opened} 
        onClose={close}
        title={editedEvent.name}
      >
      <>

        {titleData()}
        {dataSelect()}
        {dataDeSelect()}
        {readySelect()}
        {daySlotsEdition()}
        <Grid>
          <Grid.Col span={2}>
          <ButtonApp 
              title={text.cancel[leng]} 
              handler={() => {
                setEditedEvent(oneEvent)
                close()
              }}
              disabled={JSON.stringify(oneEvent) === JSON.stringify(editedEvent)}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <ButtonApp 
              title={text.save[leng]} 
              handler={() => updateEvent(oneEvent, editedEvent)} 
              disabled={JSON.stringify(oneEvent) === JSON.stringify(editedEvent)}
            />
          </Grid.Col>
        </Grid>

      </>
      </Modal>
      <ButtonApp title={text.edit[leng]} handler={open} />
    </>
  )

}