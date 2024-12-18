import React, { useEffect, useMemo, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Grid, Paper, TextInput, Slider, Text, Checkbox, Accordion } from '@mantine/core'
import { ButtonApp } from '../comps/ButtonApp.tsx'
import { TimeInput } from '@mantine/dates'
import { DatePicker } from '@mantine/dates'
import { EventStatus } from '../../modules/tsEnums.ts'

interface EditedEvent {
  idEvent: string,
  name: string,
  status: EventStatus,
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

export function ModalCreateEvent({text, leng, oneEvent, updateEvent, setEvents}) {

  const [stat, setStat] = useState(0)
  const [opened, { open, close }] = useDisclosure(false)
  const [natureEvent] = useState(oneEvent)
  const [editedEvent, setEditedEvent] = useState<EditedEvent>(getEditedEvent(oneEvent))
  const [dateStartPeriod, setDateStartPeriod] = useState(editedEvent.dateStartPeriod)
  const [daysForDelete, setDaysForDelete] = useState<Date[]>(editedEvent.daysForDelete)
  const [daysArrow, setDaysArrow] = useState<Date[]>(editedEvent.daysArrow)
  const [currentEditDays, setCurrentEditDays] = useState<Date[]>(editedEvent.currentEditDays)
  const [checked, setChecked] = useState(editedEvent.checked)
  const [checkedEdit, setCheckedEdit] = useState(editedEvent.checkedEdit)
  const [checkedAll, setCheckedAll] = useState(editedEvent.checkedAll)
  const [referensDay, setReferensDay] = useState<Date | false>(editedEvent.referensDay)

  useEffect(() => {
    if(JSON.stringify(oneEvent) !== JSON.stringify(natureEvent)){
      console.log(stat)
      const res = getEditedEvent(oneEvent)
      setEditedEvent(res)
      setDateStartPeriod(res.dateStartPeriod)
      setDaysForDelete(res.daysForDelete)
      setDaysArrow(res.daysArrow)
      setCurrentEditDays(res.currentEditDays)
      setChecked(res.checked)
      setCheckedEdit(res.checkedEdit)
      setCheckedAll(res.checkedAll)
      setReferensDay(res.referensDay)
    }
  }, [])

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
        editedEvent.daysArrow = res
        
        editedEvent.days = editedEvent.days.filter(item => res.map(item => item.getTime()).includes(item.day.getTime()))
        editedEvent.status = EventStatus.Edit
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
          editedEvent.currentEditDays = res
          setReferensDay(res[0])
          editedEvent.referensDay = res[0]
        }
      }

  }, [dateStartPeriod, checked, daysForDelete, editedEvent])

  const updateEditedEvent = {

    updateDateStartPeriod: (data) => {
      console.log('dateStartPeriod')
      setDateStartPeriod(data)
      editedEvent.dateStartPeriod = data
    },
    updateDaysForDelete: (data) => {
      console.log('daysForDelete')
      setDaysForDelete(data)
      editedEvent.daysForDelete = data
    },
    updateDaysArrow: (data) => {
      console.log('daysArrow')
      setDaysArrow(data)
      editedEvent.daysArrow = data
    },
    updateCurrentEditDays: (data) => {
      console.log('currentEditDays')
      setCurrentEditDays(data)
      editedEvent.currentEditDays = data
    },
    updateChecked: (data) => {
      console.log('checked')
      setChecked(data)
      editedEvent.checked = data
    },
    updateCheckedEdit: (data) => {
      console.log('checkedEdit')
      setCheckedEdit(data)
      editedEvent.checkedEdit = data
    },
    updateCheckedAll: (data) => {
      console.log('checkedAll')
      setCheckedAll(data)
      editedEvent.checkedAll = data
    },
    updateReferensDay: (data) => {
      console.log('referensDay')
      setReferensDay(data)
      editedEvent.referensDay = data
    }
  }
  const handlers = {
    
    addSlot: (existDay) => {
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
    getTimeNextEvent: () => {
      if(referensDay){
        const existDay = editedEvent.days.find(item => item.day.getTime() === referensDay.getTime())
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
              <ButtonApp title={`${timeToTwoDigits(upH)}:${timeToTwoDigits(upM)} ${text.addSlot[leng]}`} handler={() => handlers.addSlot(existDay)} />
            )
          }
          return (
            <ButtonApp title={text.addSlot[leng]} disabled={true}/>
          )
        }
      }
    },
    // openForReg: (item) => {
    //   if(item.onepForResistration){
    //     return (
    //       <ButtonApp
    //         title={'Close for registration'}
    //         handler={() => {
    //           item.onepForResistration = false
    //           setStat(Date.now())
    //         }}
    //     />
    //     )
    //   }
    //   return (
    //     <ButtonApp
    //       title={'Open for registration'}
    //       handler={() => {
    //         item.onepForResistration = true
    //         setStat(Date.now())
    //       }}
    //   />
    //   )

    // },
    filterDays: () => {
      if(dateStartPeriod[0] && dateStartPeriod[1]){
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
                    updateEditedEvent.updateDaysForDelete([])
                    updateEditedEvent.updateCurrentEditDays([])
                    updateEditedEvent.updateReferensDay(false)
                    updateEditedEvent.updateCheckedAll(false)
                    updateEditedEvent.updateCheckedEdit([9 ,9, 9, 9, 9, 9, 9])
                    updateEditedEvent.updateChecked([...checked])
                    // editedEvent.checked = [...checked]
                  }}
                />
              </Grid.Col>)}
          </Grid>
        )
      }
    },
    daySlotsEdition: () => {
      let main = true
      const colorEdit = (time) => {
        if(editedEvent && time){
          if(referensDay && time.getTime() === referensDay.getTime()){
            return 'green'
          }
          else if(referensDay && JSON.stringify(editedEvent.days.find(item => item.day.getTime() === time.getTime())?.slots) === JSON.stringify(editedEvent.days.find(item => item.day.getTime() === referensDay.getTime())?.slots)){
            return 'yellow'
          }
          main = false
          // return 'red'
        }
      }
      const saveButton = () => {
        if(referensDay && currentEditDays.length > 1 && !main){
          return (
                  <ButtonApp 
                    title={text.updateAllDay[leng]} 
                    handler={() => handlers.copySlots()} 
                    // disabled={main}
                  />
          )
        }
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
                          handler={() => updateEditedEvent.updateReferensDay(item)} 
                          color={colorEdit(item)}
                        />
                      </Grid.Col>
                    )}
                  </Grid>
                </Grid.Col>
                <Grid.Col span={12} style={{marginTop: '1vmax'}}>
                  {handlers.dayEvents()}
                </Grid.Col>
                <Grid.Col span={4} style={{marginTop: '1vmax'}}>
                  {handlers.getTimeNextEvent()}
                </Grid.Col>
                <Grid.Col span={3} style={{marginTop: '1vmax'}}>
                </Grid.Col>
                <Grid.Col span={5} style={{marginTop: '1vmax'}}>
                  {saveButton()}
                </Grid.Col>
              </Grid>
            </Paper>
        )
      }
    },
    copySlots: () => {
      if(referensDay){
        const copiedSlots = editedEvent.days.find(item => item.day.getTime() === referensDay.getTime())
        console.log(copiedSlots)
        for(const i of currentEditDays){
          const newSlots = editedEvent.days.find(item => item.day.getTime() === i.getTime())
          console.log(newSlots)
          if(referensDay && newSlots && copiedSlots){
            newSlots.slots = [...copiedSlots.slots]
          }
        }
        setStat(Date.now())
      }
    },
    dayEvents: () => {
      if(referensDay){
        const editedSlots: Slots[] = (editedEvent.days[editedEvent.days.findIndex(item => item.day.getTime() === referensDay.getTime())]).slots

        return editedSlots.map((item, index) => 
        <Grid.Col key={index} span={12}>
          <Paper withBorder p="lg" radius="md" shadow="md">
            <Grid align="flex-end">
              <Grid.Col span={2.4}>
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
              <Grid.Col span={2.4}>
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
              <Grid.Col span={2.4}>
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
              <Grid.Col span={2.4}>
                <TextInput
                  disabled={index !== editedSlots.length - 1}
                  onChange={(event) => {
                    item.maxClients = Number(event.currentTarget.value)
                    setStat(Date.now())
                  }}
                  value={item.maxClients}
                  size="xs"
                  radius="sm"
                  label={text.pausmin[leng]}
                />
              </Grid.Col>
              <Grid.Col span={2.4}>
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
      }
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
                      updateEditedEvent.updateReferensDay(false)
                    }
                  }
                  updateEditedEvent.updateCheckedEdit([...checkedEdit])
                  updateEditedEvent.updateCheckedAll(false)
                  const res = daysArrow.filter(item => checkedEdit.includes(item.getDay()))
                  updateEditedEvent.updateCurrentEditDays(res)
                  updateEditedEvent.updateReferensDay(res.length ? res[0] : false)
                  
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
                    updateEditedEvent.updateReferensDay(value ? value[0] : false)
                  }
                  if(value.length !== currentEditDays.length){
                    updateEditedEvent.updateCheckedAll(false)
                  }
                  if(value.length === daysArrow.length){
                    updateEditedEvent.updateCheckedAll(true)
                  }
                  updateEditedEvent.updateCurrentEditDays(value)
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
                    updateEditedEvent.updateCheckedAll(event.currentTarget.checked)
                    if(event.currentTarget.checked){
                      updateEditedEvent.updateCurrentEditDays(daysArrow)
                      updateEditedEvent.updateReferensDay(daysArrow[0])
                      updateEditedEvent.updateCheckedEdit([0 ,1, 2, 3, 4, 5, 6])
                    }
                    else{
                      updateEditedEvent.updateReferensDay(false)
                      updateEditedEvent.updateCurrentEditDays([])
                      updateEditedEvent.updateCheckedEdit([9 ,9, 9, 9, 9, 9, 9])
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
                  updateEditedEvent.updateDaysForDelete(value)
                }}
                minDate={dateStartPeriod[0]}
                maxDate={dateStartPeriod[1]}
              />
          </>
        )
      }
    }
  }

  const titleData = () => {
    return (
      <Grid>
        <Grid.Col span={3.5}>
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
        <Grid.Col span={3.5}>
          <div>
            {dateStartPeriod[0] ? dateStartPeriod[0].toLocaleDateString() : ''} {' - '}
            {dateStartPeriod[1] ? dateStartPeriod[1].toLocaleDateString() : ''} {' - '}
            ({(daysArrow ? daysArrow.length : '')})
            </div>
        </Grid.Col>
        <Grid.Col span={2}>
          <ButtonApp
            color={'green'} 
            title={text.public[leng]} 
            handler={() => {
              updateEvent(oneEvent, {...editedEvent, status: EventStatus.Public})
              close()
            }
          }
            disabled={!editedEvent.days.length || (JSON.stringify(oneEvent) !== JSON.stringify(editedEvent)) || !dateStartPeriod[1]}
            />
        </Grid.Col>
        <Grid.Col span={1.5}>
          <ButtonApp 
            title={text.cancel[leng]} 
            handler={() => {
              setEditedEvent(getEditedEvent(oneEvent))
              close()
            }}
            disabled={JSON.stringify(oneEvent) === JSON.stringify(editedEvent)}
            />
        </Grid.Col>
        <Grid.Col span={1.5}>
          <ButtonApp 
              title={text.save[leng]} 
              handler={() => {
                updateEvent(oneEvent, editedEvent)
              }
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
                updateEditedEvent.updateChecked([0 ,1, 2, 3, 4, 5, 6])
                updateEditedEvent.updateDateStartPeriod(value)
                if(value[0] && value[1]){
                  updateEditedEvent.updateDaysForDelete([])
                  updateEditedEvent.updateCurrentEditDays([])
                  updateEditedEvent.updateReferensDay(false)
                  updateEditedEvent.updateCheckedAll(false)
                  updateEditedEvent.updateCheckedEdit([9 ,9, 9, 9, 9, 9, 9])
                }
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
          <Accordion.Control disabled={(!dateStartPeriod[0] || !dateStartPeriod[1]) || daysArrow.length < 2}><Text>{text.step[leng]} 2 {text.weekends[leng]}</Text></Accordion.Control>
          <Accordion.Panel>
          {handlers.editOneMultiEventDis()}
        </Accordion.Panel>
      </Accordion.Item>
    )
  }
  const readySelect = () => {
    return (
        <Accordion.Item value="3">
          <Accordion.Control disabled={!dateStartPeriod[0] || !dateStartPeriod[1] || daysArrow.length === 0}><Text>{text.step[leng]} 3 {text.daysEdit[leng]}</Text></Accordion.Control>
          <Accordion.Panel>
            {handlers.editOneMultiEvent()}
            {handlers.daySlotsEdition()}
        </Accordion.Panel>
        </Accordion.Item>
    )
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