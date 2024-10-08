import {Box, Button, Dialog, Flex, Radio, Select, Stack, Text, TextInput} from '@sanity/ui'
import React, {useCallback, useMemo, useState} from 'react'
import {Options, RRule, rrulestr, Weekday} from 'rrule'
import {type ObjectInputProps, set} from 'sanity'

import {DEFAULT_COUNTS} from '../../constants'
import {PluginConfig} from '../../types'
import {DateInput} from '../DateInputs'
import {Monthly} from './Monthly'
import {Weekly} from './Weekly'

export function CustomRule({
  open,
  onClose,
  onChange,
  initialValue,
  startDate,
  dateTimeOptions,
}: {
  open: boolean
  onClose: () => void
  onChange: ObjectInputProps['onChange']
  initialValue: string
  startDate: string | undefined
  dateTimeOptions: PluginConfig['dateTimeOptions']
}): React.JSX.Element {
  const initialRule = useMemo(() => {
    return initialValue ? rrulestr(initialValue) : new RRule()
  }, [initialValue])

  const [frequency, setFrequency] = useState<Options['freq']>(initialRule.origOptions.freq || 1)
  const [interval, setInterval] = useState<Options['interval']>(
    initialRule.origOptions.interval || 1,
  )
  const [count, setCount] = useState<Options['count']>(initialRule.origOptions.count || null)
  const [until, setUntil] = useState<Options['until'] | number>(
    initialRule.origOptions.until || null,
  )
  const [byweekday, setByweekday] = useState<Options['byweekday']>(
    initialRule.origOptions.byweekday || null,
  )

  const handleChange = useCallback(
    (event: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLSelectElement>) => {
      const {name, value} = event.currentTarget

      if (name === 'freq') {
        setFrequency(Number(value))
      } else if (name === 'interval') {
        setInterval(Number(value))
      } else if (name === 'count') {
        setCount(Number(value))
      }
    },
    [],
  )

  const getUntilDate = useCallback(() => {
    const fromDate = new Date(startDate ? startDate : Date.now())

    if (frequency === RRule.YEARLY) {
      fromDate.setFullYear(fromDate.getFullYear() + DEFAULT_COUNTS[frequency])
    } else if (frequency === RRule.MONTHLY) {
      fromDate.setMonth(fromDate.getMonth() + DEFAULT_COUNTS[frequency])
    } else if (frequency === RRule.WEEKLY) {
      fromDate.setDate(fromDate.getDate() + DEFAULT_COUNTS[frequency] * 7)
    } else if (frequency === RRule.DAILY) {
      fromDate.setDate(fromDate.getDate() + DEFAULT_COUNTS[frequency])
    }

    return fromDate
  }, [frequency, startDate])

  const handleUntilChange = useCallback((date: string | null) => {
    if (date) {
      setUntil(new Date(date))
    }
  }, [])

  const handleEndChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const {value} = event.currentTarget

      if (!value) {
        setUntil(null)
        setCount(null)
      } else if (value == 'count') {
        setCount(DEFAULT_COUNTS[frequency])
        setUntil(null)
      } else if (value == 'until') {
        const untilDate = getUntilDate()
        setUntil(untilDate)
        setCount(null)
      }
    },
    [frequency, getUntilDate],
  )

  const handleConfirm = useCallback(() => {
    const newOptions = {
      freq: frequency,
      interval,
      count: count || null,
      until: until ? (until as Date) : null,
      byweekday,
    }

    const newRule = new RRule(newOptions)

    onClose()
    onChange(set(newRule.toString(), ['rrule']))
  }, [byweekday, count, frequency, interval, onChange, onClose, until])

  return open ? (
    <Dialog
      header="Custom recurrence"
      id="dialog-example"
      onClose={onClose}
      zOffset={1000}
      width={1}
    >
      <Flex direction="column">
        <Box flex={1} overflow="auto" padding={4}>
          <Stack space={4}>
            <Flex gap={2} align="center">
              <Text style={{whiteSpace: 'nowrap'}}>Repeat every</Text>
              <Box style={{width: '75px'}}>
                <TextInput name="interval" type="number" value={interval} onChange={handleChange} />
              </Box>
              <Box>
                <Select name="freq" value={frequency} onChange={handleChange}>
                  <option value={RRule.YEARLY}>years</option>
                  <option value={RRule.MONTHLY}>months</option>
                  <option value={RRule.WEEKLY}>weeks</option>
                  <option value={RRule.DAILY}>days</option>
                </Select>
              </Box>
            </Flex>

            {frequency === RRule.MONTHLY && (
              <Monthly byweekday={byweekday as Weekday} setByweekday={setByweekday} />
            )}

            {frequency === RRule.WEEKLY && (
              <Weekly byweekday={byweekday as Weekday} setByweekday={setByweekday} />
            )}

            <Stack space={2}>
              <Text>Ends</Text>
              <Flex gap={2} paddingY={2} align="center">
                <Radio
                  checked={!count && !until}
                  name="ends"
                  onChange={handleEndChange}
                  value=""
                  id="ends-never"
                />
                <Text htmlFor="ends-never" as="label">
                  Never
                </Text>
              </Flex>
              <Flex gap={2} align="center">
                <Radio
                  checked={!!until}
                  name="ends"
                  onChange={handleEndChange}
                  value="until"
                  id="ends-until"
                />
                <Text htmlFor="ends-until" as="label" style={{width: '75px'}}>
                  On
                </Text>
                <Box style={{width: '200px'}}>
                  <DateInput
                    id="until"
                    onChange={handleUntilChange}
                    type={{
                      name: 'until',
                      title: 'Date',
                      options: dateTimeOptions,
                    }}
                    value={until ? new Date(until) : getUntilDate()}
                    disabled={!until}
                  />
                </Box>
              </Flex>
              <Flex gap={2} align="center">
                <Radio
                  checked={!!count}
                  name="ends"
                  onChange={handleEndChange}
                  value="count"
                  id="ends-count"
                />
                <Text htmlFor="ends-count" as="label" style={{width: '75px'}}>
                  After
                </Text>
                <Box style={{width: '75px'}}>
                  <TextInput
                    name="count"
                    type="number"
                    value={count || DEFAULT_COUNTS[frequency]}
                    onChange={handleChange}
                    disabled={!count}
                  />
                </Box>
                <Text style={{whiteSpace: 'nowrap'}}>occurrences</Text>
              </Flex>
            </Stack>
          </Stack>
        </Box>
        <Box paddingX={4} paddingY={3} style={{borderTop: '1px solid var(--card-border-color)'}}>
          <Flex gap={2} justify="flex-end">
            <Button text="Cancel" mode="ghost" onClick={onClose} />
            <Button text="Done" tone="positive" onClick={handleConfirm} />
          </Flex>
        </Box>
      </Flex>
    </Dialog>
  ) : (
    <></>
  )
}
