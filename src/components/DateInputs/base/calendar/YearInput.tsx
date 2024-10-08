import {TextInput} from '@sanity/ui'
import React from 'react'

import {LazyTextInput} from '../LazyTextInput'

type Props = Omit<React.ComponentProps<typeof TextInput>, 'onChange' | 'value'> & {
  value?: number
  onChange: (year: number) => void
}

export const YearInput = ({onChange, ...props}: Props): React.JSX.Element => {
  const handleChange = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = parseInt(event.currentTarget.value, 10)
      if (!isNaN(numericValue)) {
        onChange(numericValue)
      }
    },
    [onChange],
  )

  return <LazyTextInput {...props} onChange={handleChange} inputMode="numeric" />
}
