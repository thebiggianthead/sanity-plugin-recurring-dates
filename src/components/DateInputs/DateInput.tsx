import {format, parse} from '@sanity/util/legacyDateFormat'
import React, {useCallback} from 'react'

import {CommonDateTimeInput} from './CommonDateTimeInput'

interface ParsedOptions {
  dateFormat: string
  calendarTodayLabel: string
}

interface SchemaOptions {
  dateFormat?: string
  calendarTodayLabel?: string
}

type DateInputProps = {
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

// This is the format dates are stored on
const VALUE_FORMAT = 'YYYY-MM-DD'
// default to how they are stored
const DEFAULT_DATE_FORMAT = VALUE_FORMAT

function parseOptions(options: SchemaOptions = {}): ParsedOptions {
  return {
    dateFormat: options.dateFormat || DEFAULT_DATE_FORMAT,
    calendarTodayLabel: options.calendarTodayLabel || 'Today',
  }
}

const deserialize = (value: string) => parse(value, VALUE_FORMAT)
const serialize = (date: Date) => format(date, VALUE_FORMAT)

/**
 * @hidden
 * @beta */
export function DateInput(props: DateInputProps) {
  const {id, onChange, type, value, disabled, ...rest} = props

  const {dateFormat} = parseOptions(type.options)

  const handleChange = useCallback(
    (nextDate: string | null) => {
      onChange(nextDate)
    },
    [onChange],
  )

  const formatInputValue = useCallback((date: Date) => format(date, dateFormat), [dateFormat])

  const parseInputValue = useCallback(
    (inputValue: string) => parse(inputValue, dateFormat),
    [dateFormat],
  )

  return (
    <CommonDateTimeInput
      id={id}
      {...rest}
      deserialize={deserialize}
      formatInputValue={formatInputValue}
      onChange={handleChange}
      parseInputValue={parseInputValue}
      readOnly={disabled}
      selectTime={false}
      serialize={serialize}
      value={value}
    />
  )
}
