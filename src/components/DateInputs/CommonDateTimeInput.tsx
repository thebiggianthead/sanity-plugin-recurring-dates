/* eslint-disable no-nested-ternary */

import {TextInput, useForwardedRef} from '@sanity/ui'
import React, {useEffect} from 'react'

import {DateTimeInput} from './base/DateTimeInput'
import {ParseResult} from './types'

export interface CommonDateTimeInputProps {
  id: string
  deserialize: (value: string) => ParseResult
  formatInputValue: (date: Date) => string
  onChange: (nextDate: string | null) => void
  parseInputValue: (inputValue: string) => ParseResult
  placeholder?: string
  readOnly: boolean | undefined
  selectTime?: boolean
  serialize: (date: Date) => string
  timeStep?: number
  value: number | Date | string | undefined | null
}

const DEFAULT_PLACEHOLDER_TIME = new Date()

export const CommonDateTimeInput = React.forwardRef(function CommonDateTimeInput(
  props: CommonDateTimeInputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const {
    id,
    deserialize,
    formatInputValue,
    onChange,
    parseInputValue,
    placeholder,
    readOnly,
    selectTime,
    serialize,
    timeStep,
    value,
    ...restProps
  } = props

  const [localValue, setLocalValue] = React.useState<string | null>(null)

  useEffect(() => {
    setLocalValue(null)
  }, [value])

  const handleDatePickerInputChange = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      const nextInputValue = event.currentTarget.value
      const result = nextInputValue === '' ? null : parseInputValue(nextInputValue)

      if (result === null) {
        onChange(null)

        // If the field value is undefined and we are clearing the invalid value
        // the above useEffect won't trigger, so we do some extra clean up here
        if (typeof value === 'undefined' && localValue) {
          setLocalValue(null)
        }
      } else if (result.isValid) {
        onChange(serialize(result.date))
      } else {
        setLocalValue(nextInputValue)
      }
    },
    [parseInputValue, onChange, value, localValue, serialize],
  )

  const handleDatePickerChange = React.useCallback(
    (nextDate: Date | null) => {
      onChange(nextDate ? serialize(nextDate) : null)
    },
    [serialize, onChange],
  )

  const forwardedRef = useForwardedRef(ref)

  const parseResult = localValue
    ? parseInputValue(localValue)
    : value
      ? deserialize(value as string)
      : null

  const inputValue = localValue
    ? localValue
    : parseResult?.isValid
      ? formatInputValue(parseResult.date)
      : (value as string)

  return readOnly ? (
    <TextInput value={inputValue} readOnly disabled={readOnly} />
  ) : (
    <DateTimeInput
      {...restProps}
      id={id}
      selectTime={selectTime}
      timeStep={timeStep}
      placeholder={placeholder || `e.g. ${formatInputValue(DEFAULT_PLACEHOLDER_TIME)}`}
      ref={forwardedRef}
      value={parseResult?.date}
      inputValue={inputValue || ''}
      readOnly={Boolean(readOnly)}
      onInputChange={handleDatePickerInputChange}
      onChange={handleDatePickerChange}
      customValidity={parseResult?.error}
    />
  )
})
