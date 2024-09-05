import {format, parse} from '@sanity/util/legacyDateFormat'
import {getMinutes, parseISO, setMinutes} from 'date-fns'
import React, {useCallback} from 'react'

import {CommonDateTimeInput} from './CommonDateTimeInput'
import {ParseResult} from './types'
import {isValidDate} from './utils'

interface ParsedOptions {
  dateFormat: string
  timeFormat: string
  timeStep: number
  calendarTodayLabel: string
}

interface SchemaOptions {
  dateFormat?: string
  timeFormat?: string
  timeStep?: number
  calendarTodayLabel?: string
}

type DateTimeInputProps = {
  id: string
  onChange: (date: string | null) => void
  disabled?: boolean
  value: number | Date | null
  type: {
    name: string
    title: string
    description?: string
    options?: SchemaOptions
    placeholder?: string
  }
}

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'
const DEFAULT_TIME_FORMAT = 'HH:mm'

function parseOptions(options: SchemaOptions = {}): ParsedOptions {
  return {
    dateFormat: options.dateFormat || DEFAULT_DATE_FORMAT,
    timeFormat: options.timeFormat || DEFAULT_TIME_FORMAT,
    timeStep: ('timeStep' in options && Number(options.timeStep)) || 1,
    calendarTodayLabel: options.calendarTodayLabel || 'Today',
  }
}

function serialize(date: Date) {
  return date.toISOString()
}
function deserialize(isoString: string): ParseResult {
  const deserialized = new Date(isoString)
  if (isValidDate(deserialized)) {
    return {isValid: true, date: deserialized}
  }
  return {isValid: false, error: `Invalid date value: "${isoString}"`}
}

// enforceTimeStep takes a dateString and datetime schema options and enforces the time
// to be within the configured timeStep
function enforceTimeStep(dateString: string, timeStep: number) {
  if (!timeStep || timeStep === 1) {
    return dateString
  }

  const date = parseISO(dateString)
  const minutes = getMinutes(date)
  const leftOver = minutes % timeStep
  if (leftOver !== 0) {
    return serialize(setMinutes(date, minutes - leftOver))
  }

  return serialize(date)
}

/**
 * @hidden
 * @beta */
export function DateTimeInput(props: DateTimeInputProps): React.JSX.Element {
  const {id, onChange, type, value, disabled, ...rest} = props

  const {dateFormat, timeFormat, timeStep} = parseOptions(type.options)

  const handleChange = useCallback(
    (nextDate: string | null) => {
      let date = nextDate
      if (date !== null && timeStep > 1) {
        date = enforceTimeStep(date, timeStep)
      }

      onChange(date)
    },
    [onChange, timeStep],
  )

  const formatInputValue = React.useCallback(
    (date: Date) => format(date, `${dateFormat} ${timeFormat}`),
    [dateFormat, timeFormat],
  )

  const parseInputValue = React.useCallback(
    (inputValue: string) => parse(inputValue, `${dateFormat} ${timeFormat}`),
    [dateFormat, timeFormat],
  )

  return (
    <CommonDateTimeInput
      id={id}
      {...rest}
      onChange={handleChange}
      deserialize={deserialize}
      formatInputValue={formatInputValue}
      parseInputValue={parseInputValue}
      selectTime
      serialize={serialize}
      timeStep={timeStep}
      value={value}
      readOnly={disabled}
    />
  )
}
