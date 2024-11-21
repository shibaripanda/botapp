import React, { useMemo, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Grid, Paper, TextInput, Slider, Text, Checkbox, Accordion, Button } from '@mantine/core'
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
  const [currentEditDays, setCurrentEditDays] = useState<Date[]>([])
  const [checked, setChecked] = useState([0 ,1, 2, 3, 4, 5, 6])
  const [checkedEdit, setCheckedEdit] = useState([9 ,9, 9, 9, 9, 9, 9])
  const [checkedAll, setCheckedAll] = useState(false)
  const [referensDay, setReferensDay] = useState<Date | false>(false)

  useMemo(() => {
    setEditedEvent(structuredClone(oneEvent))
  }, [oneEvent])
  useMemo(() => {

    setCheckedEdit([9 ,9, 9, 9, 9, 9, 9])
    setReferensDay(false)
    setCheckedAll(false)

    if(dateStartPeriod[0] && dateStartPeriod[1]){
      const result: Date[] = []
      const startTime = dateStartPeriod[0].getTime()
      const endTime = dateStartPeriod[1].getTime()
      const countDays = ((endTime - startTime) / 86400000) + 1
      for(let i = 0; i < countDays; i++){
        result.push(new Date(startTime + (86400000 * i)))
      }
      const res = result.filter(item => checked.includes(item.getDay())).filter(item => !daysForDelete.map(item => item.getTime()).includes(item.getTime()))
      setDaysArrow(res)
      if(res.length === 1){
        setCurrentEditDays(res)
        setReferensDay(res[0])
      }
    }

  }, [dateStartPeriod, checked, daysForDelete])


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

    },
    filterDays: () => {
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
                  setCurrentEditDays([])
                }}
              />
            </Grid.Col>)}
        </Grid>
      )
    },
    daySlotsEdition: () => {
      const colorEdit = (time) => {
        if(referensDay && time.getTime() === referensDay.getTime()){
          return 'green'
        }
      }
      if(currentEditDays.length){
        // setReferensDay(currentEditDays[0])
        return (
            <Paper withBorder p="lg" radius="md" shadow="md" style={{marginTop: '2vmax', marginBottom: '2vmax'}}>
              <Grid>
                <Grid.Col span={12} style={{marginTop: '1vmax'}}>
                  <Grid>
                    {currentEditDays.map((item, index) =>
                      <Grid.Col span={1.7} key={index}>
                        <ButtonApp 
                          title={item.getDate() + '.' + (item.getMonth() + 1) + '.' + item.getFullYear()}
                          handler={() => setReferensDay(item)} 
                          color={colorEdit(item)}
                        />
                      </Grid.Col>
                    )}
                  </Grid>
                </Grid.Col>
                <Grid.Col span={12} style={{marginTop: '1vmax'}}>
                  {handlers.dayEvents}
                </Grid.Col>
                <Grid.Col span={3} style={{marginTop: '1vmax'}}>
                  {handlers.getTimeNextEvent()}
                </Grid.Col>
                <Grid.Col span={7} style={{marginTop: '1vmax'}}>
                </Grid.Col>
                <Grid.Col span={2} style={{marginTop: '1vmax'}}>
                  <ButtonApp 
                    title={text.save[leng]} 
                    handler={() => updateEvent(oneEvent, editedEvent)} 
                    disabled={JSON.stringify(oneEvent) === JSON.stringify(editedEvent)}
                  />
                </Grid.Col>
              </Grid>
            </Paper>
        )
      }
    },
    dayEvents: editedEvent.slots.map((item, index) => 
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
    ),
    filterDaysEditDays: () => {
      return (
        <Grid>
          {checkedEdit.map((item, index) => 
            <Grid.Col span={1.5} key={index}>
                <Checkbox
                disabled={!checked.includes(index) || !daysArrow.map(item => item.getDay()).includes(index)}
                label={text[`day${index}`][leng].substring(0, 3)}
                checked={checkedEdit.includes(index)}
                onChange={(event) => {
                  if(event.currentTarget.checked){
                    checkedEdit[index] = index
                  }
                  else{
                    checkedEdit[index] = 9
                    if(referensDay && referensDay.getDay() === index){
                      setReferensDay(false)
                    }
                  }
                  setCheckedEdit([...checkedEdit])
                  setCheckedAll(false)
                  const res = daysArrow.filter(item => checkedEdit.includes(item.getDay()))
                  setCurrentEditDays(res)
                }}
              />
            </Grid.Col>)}
        </Grid>
      )
    },
    editOneMultiEvent: () => {
      if(daysArrow.length > 1 && dateStartPeriod[0] && dateStartPeriod[1]){
        return (
          <>
            <DatePicker
                locale={leng}
                monthsListFormat="MM" 
                size="xs" 
                maxLevel="month"
                hideOutsideDates
                excludeDate={(date) => daysForDelete.map(item => item.getTime()).includes(date.getTime()) || !checked.includes(date.getDay())} 
                type="multiple"
                numberOfColumns={3} 
                value={currentEditDays} 
                onChange={(value) => {
                  if(referensDay && !value.map(item => item.getTime()).includes(referensDay.getTime())){
                    setReferensDay(false)
                  }
                  if(value.length !== currentEditDays.length){
                    setCheckedAll(false)
                  }
                  if(value.length === daysArrow.length){
                    setCheckedAll(true)
                  }
                  console.log(value.length === daysArrow.length)
                  console.log(value.length)
                  console.log(daysArrow.length)
                  setCurrentEditDays(value)
                }}
                minDate={dateStartPeriod[0]}
                maxDate={dateStartPeriod[1]}
              />
            {handlers.filterDaysEditDays()}
              <div style={{marginTop: '1vmax'}}>
                <Checkbox
                  label={text.selectAll[leng]}
                  checked={checkedAll}
                  onChange={(event) => {
                    setCheckedAll(event.currentTarget.checked)
                    if(event.currentTarget.checked){
                      setCurrentEditDays(daysArrow)
                      setCheckedEdit([0 ,1, 2, 3, 4, 5, 6])
                    }
                    else{
                      setReferensDay(false)
                      setCurrentEditDays([])
                      setCheckedEdit([9 ,9, 9, 9, 9, 9, 9])
                    }
                  }}
                />
              </div>
          </>
        )
      }
    },
    editOneMultiEventDis: () => {
      if(daysArrow.length > 1 && dateStartPeriod[0] && dateStartPeriod[1]){
        return (
          <>
            <DatePicker
                locale={leng}
                monthsListFormat="MM" 
                size="xs" 
                maxLevel="month"
                hideOutsideDates      
                excludeDate={(date) => !checked.includes(date.getDay())} 
                type="multiple"
                numberOfColumns={3} 
                value={daysForDelete}
                onChange={(value) => {
                  setDaysForDelete(value)
                  setCurrentEditDays([])
                }}
                minDate={dateStartPeriod[0]}
                maxDate={dateStartPeriod[1]}
              />
          </>
        )
      }
      // else{
      //   return (
      //     <>{text.oneDayEvent[leng]}</>
      //   )
      // }
    }
  }

  const titleData = () => {
    return (
      <Grid>
        <Grid.Col span={4}>
          <TextInput
            onChange={(event) => {
              editedEvent.name = event.currentTarget.value
              setStat(Date.now())
            }}
            value={editedEvent.name}
            size="xs"
            radius="sm"
            style={{marginBottom: '1vmax'}}
          />
          </Grid.Col>
          <Grid.Col span={4}>
          <div>
            {dateStartPeriod[0] ? dateStartPeriod[0].toLocaleDateString() : ''} {' - '}
            {dateStartPeriod[1] ? dateStartPeriod[1].toLocaleDateString() : ''} {' - '}
            ({(daysArrow ? daysArrow.length : '')})
            </div>
        </Grid.Col>
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
    )
  }
  const dataSelect = () => {
    return (
        <Accordion.Item value="1">
          <Accordion.Control><Text>{text.step[leng]} 1 {text.daysOrPeriod[leng]}</Text></Accordion.Control>
          <Accordion.Panel>
            <DatePicker
              locale={leng}
              monthsListFormat="MM" 
              size="xs"
              excludeDate={(date) => !checked.includes(date.getDay())}  
              maxLevel="month" 
              minDate={new Date(Date.now())} 
              hideOutsideDates 
              allowSingleDateInRange 
              type="range"
              numberOfColumns={3} 
              value={dateStartPeriod} 
              onChange={(value) => {
                setDateStartPeriod(value)
                setCurrentEditDays([])
              }}
            />
            {/* <hr></hr> */}
            <div style={{marginTop: '1vmax', marginBottom: '1vmax'}}>
              {handlers.filterDays()}
            </div>
          </Accordion.Panel>
        </Accordion.Item>
    )
  }
  const dataDeSelect = () => {
    // if(dateStartPeriod[0] && dateStartPeriod[1]){
      return (
          <Accordion.Item value="2">
            <Accordion.Control disabled={(!dateStartPeriod[0] || !dateStartPeriod[1]) || daysArrow.length === 1}><Text>{text.step[leng]} 2 {text.weekends[leng]}</Text></Accordion.Control>
            <Accordion.Panel>
            {handlers.editOneMultiEventDis()}
          </Accordion.Panel>
        </Accordion.Item>
      )
    // }
  }
  const readySelect = () => {
    // if(dateStartPeriod[0] && dateStartPeriod[1]){
      return (
          <Accordion.Item value="3">
            <Accordion.Control disabled={!dateStartPeriod[0] || !dateStartPeriod[1]}><Text>{text.step[leng]} 3 {text.daysEdit[leng]}</Text></Accordion.Control>
            <Accordion.Panel>
              {handlers.editOneMultiEvent()}
              {handlers.daySlotsEdition()}
          </Accordion.Panel>
          </Accordion.Item>
      )
    // }
  }

  return (
    <>
      <Modal size={'65vmax'} opened={opened} 
        onClose={close}
        title={editedEvent.name}
      >
      <>

        {titleData()}
        <Accordion variant="separated">
        {readySelect()}
        {dataDeSelect()}
        {dataSelect()}
        </Accordion>

      </>
      </Modal>
      <ButtonApp title={text.edit[leng]} handler={open} />
    </>
  )

}