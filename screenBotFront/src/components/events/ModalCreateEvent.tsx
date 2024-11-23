import React, { useMemo, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Grid, Paper, TextInput, Slider, Text, Checkbox, Accordion } from '@mantine/core'
import { ButtonApp } from '../comps/ButtonApp.tsx'
import { TimeInput } from '@mantine/dates'
import { DatePicker } from '@mantine/dates'

interface EditedEvent {
  idEvent: string,
  name: string,
  status: string,
  dateStartPeriod: [Date | null, Date | null],
  daysForDelete: Date[],
  checked: number[],
  referensDay: Date | false,
  currentEditDays: Date[],
  daysArrow: Date[],
  checkedEdit: number[],
  checkedAll: boolean,
  days: Day[] 
}
interface Slots { 
  startTime: string, 
  duration: number, 
  break: number, 
  clients: [], 
  maxClients: number,
  openForRegistration: boolean
}
interface Day {
  day: Date,
  slots: Slots[]
}

const getEditedEvent = (oneEvent) => {
  const res = structuredClone(oneEvent)
  res.days = res.days.map(item => ({...item, day: new Date(item.day)}))
  res.dateStartPeriod = res.dateStartPeriod.map(item => item ? new Date(item) : null)
  res.daysForDelete = res.daysForDelete.map(item => new Date(item))
  res.daysArrow =  res.daysArrow.map(item => new Date(item))
  res.currentEditDays = res.currentEditDays.map(item => new Date(item))
  res.referensDay = res.referensDay ? new Date(res.referensDay) : false
  return res
}

export function ModalCreateEvent({text, leng, oneEvent, updateEvent}) {

  const [stat, setStat] = useState(0)
  const [opened, { open, close }] = useDisclosure(false)

  const [editedEvent, setEditedEvent] = useState<EditedEvent>(getEditedEvent(oneEvent))

  const [dateStartPeriod, setDateStartPeriod] = useState(editedEvent.dateStartPeriod)
  const [daysForDelete, setDaysForDelete] = useState<Date[]>(editedEvent.daysForDelete)
  const [daysArrow, setDaysArrow] = useState<Date[]>(editedEvent.daysArrow)
  const [currentEditDays, setCurrentEditDays] = useState<Date[]>(editedEvent.currentEditDays)
  const [checked, setChecked] = useState(editedEvent.checked)
  const [checkedEdit, setCheckedEdit] = useState(editedEvent.checkedEdit)
  const [checkedAll, setCheckedAll] = useState(editedEvent.checkedAll)
  const [referensDay, setReferensDay] = useState<Date | false>(editedEvent.referensDay)

  console.log(editedEvent)
  useMemo(() => {
    

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
        for(const i of res){
          const day = editedEvent.days.find(item => item.day.getTime() === i.getTime())
          if(!day){
            editedEvent.days.push(
              {day: i,
              slots: [{
                startTime: '09:00', 
                duration: 45, 
                break: 15, 
                clients: [], 
                maxClients: 1,
                openForRegistration: true
            }]})
        }
        }
        if(res.length === 1){
          setCurrentEditDays(res)
          setReferensDay(res[0])
        }
      }
  }, [dateStartPeriod, checked, daysForDelete, editedEvent])

  const handlers = {
    addSlot: (existDay) => {
      console.log(stat)
      const clock = existDay.slots[existDay.slots.length - 1].startTime.split(':')
      let x = Number(clock[1]) + existDay.slots[existDay.slots.length - 1].duration + existDay.slots[existDay.slots.length - 1].break
      const upH = Number(clock[0]) + Math.floor(x / 60)
      const upM = x % 60

      const timeToTwoDigits = (digit: number) => {
        if(digit.toString().length === 1){
          return '0' + digit
        }
        return digit
      }
      if(Number(timeToTwoDigits(upH)) < 24){
        existDay.slots[existDay.slots.length] = structuredClone(existDay.slots[existDay.slots.length - 1])
        existDay.slots[existDay.slots.length - 1].startTime = `${timeToTwoDigits(upH)}:${timeToTwoDigits(upM)}`
        setStat(Date.now())
      }
    },
    getTimeNextEvent: (day) => {
      if(day){
        const existDay = editedEvent.days.find(item => item.day.getTime() === day.getTime())
        if(existDay){
          const clock = existDay.slots[existDay.slots.length - 1].startTime.split(':')
          let x = Number(clock[1]) + existDay.slots[existDay.slots.length - 1].duration + existDay.slots[existDay.slots.length - 1].break
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
              <ButtonApp title={`${text.addSlot[leng]} ${timeToTwoDigits(upH)}:${timeToTwoDigits(upM)}`} handler={() => handlers.addSlot(existDay)} />
            )
            // setStat(Date.now())
          }
          return (
            <ButtonApp title={text.addSlot[leng]} disabled={true}/>
          )
        }
      }
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

                  setCheckedEdit([9 ,9, 9, 9, 9, 9, 9])
                  setReferensDay(false)
                  setCheckedAll(false)

                }}
              />
            </Grid.Col>)}
        </Grid>
      )
    },
    daySlotsEdition: () => {
      console.log(referensDay)
      let main = true
      const colorEdit = (time) => {
        if(editedEvent && time){
          if(referensDay && time.getTime() === referensDay.getTime()){
            return 'green'
          }
          else if(referensDay && JSON.stringify(editedEvent.days.find(item => item.day.getTime() === time.getTime()).slots) === JSON.stringify(editedEvent.days.find(item => item.day.getTime() === referensDay.getTime()).slots)){
            return 'yellow'
          }
        }
        main = false
      }
      if(currentEditDays.length){
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
                  {handlers.dayEvents(referensDay)}
                </Grid.Col>
                <Grid.Col span={3} style={{marginTop: '1vmax'}}>
                  {handlers.getTimeNextEvent(referensDay)}
                </Grid.Col>
                <Grid.Col span={7} style={{marginTop: '1vmax'}}>
                </Grid.Col>
                <Grid.Col span={2} style={{marginTop: '1vmax'}}>
                  <ButtonApp 
                    title={text.save[leng]} 
                    handler={() => handlers.copySlots()} 
                    disabled={main}
                  />
                </Grid.Col>
              </Grid>
            </Paper>
        )
      }
    },
    copySlots: () => {
      for(const i of currentEditDays){
        if(referensDay) editedEvent.days.find(item => item.day.getTime() === i.getTime()).slots = [...editedEvent.days.find(item => item.day.getTime() === referensDay.getTime()).slots]
      }
      setStat(Date.now())
    },
    dayEvents: (day) => {

      const editedSlots: Slots[] = (editedEvent.days[editedEvent.days.findIndex(item => item.day.getTime() === day.getTime())]).slots

      return editedSlots.map((item, index) => 
      <Grid.Col key={index} span={12}>
        <Paper withBorder p="lg" radius="md" shadow="md">
          <Grid align="flex-end">
            <Grid.Col span={3}>
            <TimeInput
              disabled={index !== editedSlots.length - 1 || editedSlots.length !== 1}
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
                disabled={index !== editedSlots.length - 1}
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
                disabled={index !== editedSlots.length - 1}
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
                disabled={index !== editedSlots.length - 1}
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
                disabled={index !== editedSlots.length - 1 || editedSlots.length === 1}
                handler={() => {
                  editedSlots.splice(-1)
                  setStat(Date.now())
                }}
              />
            </Grid.Col>
          </Grid>
        </Paper>
      </Grid.Col>)
    },
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
                  setReferensDay(res.length ? res[0] : false)
                  
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
                  if((referensDay && !value.map(item => item.getTime()).includes(referensDay.getTime())) || !referensDay){
                    setReferensDay(value ? value[0] : false)
                  }
                  if(value.length !== currentEditDays.length){
                    setCheckedAll(false)
                  }
                  if(value.length === daysArrow.length){
                    setCheckedAll(true)
                  }
                  setCurrentEditDays(value)
                }}
                minDate={dateStartPeriod[0]}
                maxDate={dateStartPeriod[1]}
              />
              <div style={{marginTop: '1vmax'}}>
                {handlers.filterDaysEditDays()}
              </div>
              <div style={{marginTop: '1vmax'}}>
                <Checkbox
                  label={text.selectAll[leng]}
                  checked={checkedAll}
                  onChange={(event) => {
                    setCheckedAll(event.currentTarget.checked)
                    if(event.currentTarget.checked){
                      setCurrentEditDays(daysArrow)
                      setReferensDay(daysArrow[0])
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
                setEditedEvent(getEditedEvent(oneEvent))
                close()
              }}
              disabled={JSON.stringify(oneEvent) === JSON.stringify(editedEvent)}
            />
        </Grid.Col>
        <Grid.Col span={2}>
          <ButtonApp 
              title={text.save[leng]} 
              handler={() => updateEvent(oneEvent, 
                {...editedEvent, 
                dateStartPeriod: dateStartPeriod, 
                daysForDelete: daysForDelete,
                checked: checked,
                referensDay: referensDay,
                currentEditDays: currentEditDays,
                daysArrow: daysArrow,
                checkedEdit: checkedEdit,
                checkedAll: checkedAll
              })
            }
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

                setCheckedEdit([9 ,9, 9, 9, 9, 9, 9])
                setReferensDay(false)
                setCheckedAll(false)

              }}
            />
            <div style={{marginTop: '1vmax', marginBottom: '1vmax'}}>
              {handlers.filterDays()}
            </div>
          </Accordion.Panel>
        </Accordion.Item>
    )
  }
  const dataDeSelect = () => {
    return (
        <Accordion.Item value="2">
          <Accordion.Control disabled={(!dateStartPeriod[0] || !dateStartPeriod[1]) || daysArrow.length === 1}><Text>{text.step[leng]} 2 {text.weekends[leng]}</Text></Accordion.Control>
          <Accordion.Panel>
          {handlers.editOneMultiEventDis()}
        </Accordion.Panel>
      </Accordion.Item>
    )
  }
  const readySelect = () => {
    return (
        <Accordion.Item value="3">
          <Accordion.Control disabled={!dateStartPeriod[0] || !dateStartPeriod[1]}><Text>{text.step[leng]} 3 {text.daysEdit[leng]}</Text></Accordion.Control>
          <Accordion.Panel>
            {handlers.editOneMultiEvent()}
            {handlers.daySlotsEdition()}
        </Accordion.Panel>
        </Accordion.Item>
    )
  }

  if(editedEvent){
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
  else{
    return <div>Loading</div>
  }

  // return <div>yyyyy</div>

}