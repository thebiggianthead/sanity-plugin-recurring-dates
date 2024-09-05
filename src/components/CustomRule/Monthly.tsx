import {Box, Flex, Select, Text} from '@sanity/ui'
import React, {useCallback} from 'react'
import {Options, Weekday} from 'rrule'

import {DAYS} from '../../constants'

interface MonthlyProps {
  byweekday: Weekday
  setByweekday: (value: Options['byweekday']) => void
}

export function Monthly(props: MonthlyProps): React.JSX.Element {
  const {byweekday, setByweekday} = props

  const {weekday: dayNo, n: weekNo} =
    byweekday && Array.isArray(byweekday) ? byweekday[0] : {weekday: null, n: null}

  const handleChange = useCallback(
    (event: React.FormEvent<HTMLSelectElement>) => {
      const {value, name} = event.currentTarget

      if (name == 'week') {
        if (value == '') {
          setByweekday(null)
        } else {
          const newWeekday = new Weekday(dayNo ? dayNo : 0, Number(value))
          setByweekday([newWeekday])
        }
      } else if (name == 'day') {
        const newWeekday = new Weekday(Number(value), weekNo ? weekNo : 1)
        setByweekday([newWeekday])
      }
    },
    [dayNo, setByweekday, weekNo],
  )

  return (
    <Flex gap={2} align="center">
      <Text style={{whiteSpace: 'nowrap'}}>On the</Text>
      <Box>
        <Select name="week" value={weekNo?.toString()} onChange={handleChange}>
          <option value="">same day</option>
          <option value="1">first</option>
          <option value="2">second</option>
          <option value="3">third</option>
          <option value="4">fourth</option>
          <option value="5">fifth</option>
          <option value="-1">last</option>
        </Select>
      </Box>
      {weekNo && (
        <Box>
          <Select name="day" value={dayNo ? dayNo : 0} onChange={handleChange}>
            {DAYS.map((day: string, i: number) => {
              const weekday = new Weekday(i)
              return (
                <option value={weekday.weekday} key={weekday.weekday}>
                  {day}
                </option>
              )
            })}
          </Select>
        </Box>
      )}
    </Flex>
  )
}
