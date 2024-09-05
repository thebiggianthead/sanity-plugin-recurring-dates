import {TextInput} from '@sanity/ui'
import React from 'react'

type TextInputProps = React.ComponentProps<typeof TextInput>

type Props = Omit<TextInputProps, 'onChange'> & {
  onChange?: (
    event: React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>,
  ) => void
}

/**
 * A TextInput that only emit onChange when it has to
 * By default it will only emit onChange when: 1) user hits enter or 2) user leaves the
 * field (e.g. onBlur) and the input value at this time is different from the given `value` prop
 */
export const LazyTextInput = React.forwardRef(function LazyTextInput(
  {onChange, onBlur, onKeyPress, value, ...rest}: Props,
  forwardedRef: React.ForwardedRef<HTMLInputElement>,
) {
  const [inputValue, setInputValue] = React.useState<string>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = React.useCallback((event: any) => {
    setInputValue(event.currentTarget.value)
  }, [])

  const checkEvent = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      const currentValue = event.currentTarget.value
      if (currentValue !== `${value}`) {
        if (onChange) {
          onChange(event)
        }
      }
      setInputValue(undefined)
    },
    [onChange, value],
  )

  const handleBlur = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      checkEvent(e)
      if (onBlur) {
        onBlur(e)
      }
    },
    [checkEvent, onBlur],
  )

  const handleKeyPress = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        checkEvent(e)
      }
      if (onKeyPress) {
        onKeyPress(e)
      }
    },
    [checkEvent, onKeyPress],
  )

  return (
    <TextInput
      {...rest}
      data-testid="date-input"
      ref={forwardedRef}
      value={inputValue === undefined ? value : inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyPress={handleKeyPress}
    />
  )
})
