import {Button, Grid, Stack, Text} from '@sanity/ui'
import React, {useCallback, useMemo} from 'react'
import {type Options, Weekday} from 'rrule'

import {DAYS} from '../../constants'

interface WeeklyProps {
  byweekday: Weekday
  setByweekday: (value: Options['byweekday']) => void
}

export function Weekly(props: WeeklyProps): React.JSX.Element {
  const {byweekday, setByweekday} = props

  const currentWeekdays: number[] = useMemo(() => {
    return Array.isArray(byweekday) ? byweekday.map((weekday) => weekday.weekday) : []
  }, [byweekday])

  const handleChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const value = Number(event.currentTarget.value)

      const index = currentWeekdays.indexOf(value)

      if (index === -1) {
        currentWeekdays.push(value)
      } else {
        currentWeekdays.splice(index, 1)
      }

      setByweekday(
        currentWeekdays.length
          ? currentWeekdays.map((currentWeekday) => new Weekday(Number(currentWeekday)))
          : null,
      )
    },
    [currentWeekdays, setByweekday],
  )

  return (
    <Stack space={3}>
      <Text style={{whiteSpace: 'nowrap'}}>Repeats on</Text>
      <Grid columns={DAYS.length} gap={1}>
        {DAYS.map((day: string, i: number) => {
          const weekday = new Weekday(i)

          return (
            <Button
              key={day}
              mode={currentWeekdays && currentWeekdays.includes(i) ? 'default' : 'ghost'}
              tone={currentWeekdays && currentWeekdays.includes(i) ? 'primary' : 'default'}
              text={weekday.toString()}
              value={i}
              style={{cursor: 'pointer'}}
              onClick={handleChange}
            />
          )
        })}
      </Grid>
    </Stack>
  )
}
