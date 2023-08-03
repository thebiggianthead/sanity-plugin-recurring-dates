import {Box, Flex, Grid, Select, Stack, Text} from '@sanity/ui'
import {upperFirst} from 'lodash'
import React, {useCallback, useState} from 'react'
import {rrulestr} from 'rrule'
import {ObjectInputMember, type ObjectInputProps, ObjectSchemaType, set} from 'sanity'
import {Feedback} from 'sanity-plugin-utils'

import type {PluginConfig, WithRequiredProperty} from '../types'
import {validateRRuleStrings} from '../utils'
import {CustomRule} from './CustomRule'
import {RemoveEndDate} from './RemoveEndDate'

type RecurringDatesProps = ObjectInputProps & {
  pluginConfig: WithRequiredProperty<PluginConfig, 'defaultRecurrences'>
}

type RecurringDateObjectSchemaType = Omit<ObjectSchemaType, 'options'> & {
  options?: PluginConfig
}

export function RecurringDates(props: RecurringDatesProps) {
  const {onChange, members, value: currentValue, schemaType, pluginConfig} = props
  const {options, title}: RecurringDateObjectSchemaType = schemaType
  const {defaultRecurrences, hideEndDate, hideCustom, dateTimeOptions} = {
    ...pluginConfig,
    ...options,
  }

  // For the custom RRULE modal
  const [open, setOpen] = useState(false)
  const onClose = useCallback(() => setOpen(false), [])
  const onOpen = useCallback(() => setOpen(true), [])

  // Update the RRULE field when the select changes
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const {value} = event.currentTarget

      if (value == 'custom') {
        onOpen()
      } else {
        onChange(set(value, ['rrule']))
      }
    },
    [onChange, onOpen],
  )

  // Validate the default recurrences
  const invalidRecurrences = validateRRuleStrings(defaultRecurrences)

  // Grab the fields we want to output from the members array
  const startDateMember = members.find(
    (member) => member.kind === 'field' && member.name === 'startDate',
  )
  const endDateMember = members.find(
    (member) => member.kind === 'field' && member.name === 'endDate',
  )
  const rruleMember = members.find((member) => member.kind === 'field' && member.name === 'rrule')

  // If we have a custom RRULE, add it to the list of options
  const availableRecurrences = [...defaultRecurrences]
  if (currentValue && !availableRecurrences.includes(currentValue?.rrule)) {
    availableRecurrences.push(currentValue?.rrule)
  }

  // Pass along functions to each member so that it knows how to render
  const renderProps = {
    renderField: props.renderField,
    renderInput: props.renderInput,
    renderItem: props.renderItem,
    renderPreview: props.renderPreview,
  }

  if (startDateMember?.kind == 'field') {
    startDateMember.field.schemaType.options = {
      ...startDateMember?.field?.schemaType.options,
      ...dateTimeOptions,
    }
  }

  if (endDateMember?.kind == 'field') {
    endDateMember.field.schemaType.options = {
      ...endDateMember?.field?.schemaType.options,
      ...dateTimeOptions,
    }
  }

  // Do we have an end date set for this field?
  const hasEndDate = currentValue && currentValue.endDate

  return (
    <Stack space={3}>
      <Grid columns={hideEndDate ? 1 : 2} gap={3}>
        {hasEndDate && hideEndDate && <RemoveEndDate title={title} onChange={onChange} />}
        <Flex align="flex-end" gap={2}>
          <Box flex={1}>
            {startDateMember && <ObjectInputMember member={startDateMember} {...renderProps} />}
          </Box>
        </Flex>
        {!hideEndDate && (
          <Flex align="flex-end" gap={2}>
            <Box flex={1}>
              {endDateMember && <ObjectInputMember member={endDateMember} {...renderProps} />}
            </Box>
          </Flex>
        )}
      </Grid>
      {invalidRecurrences ? (
        <Feedback tone="critical">
          <Text size={1}>
            <strong>Error:</strong> An invalid RRULE string was provided in the{' '}
            <code>defaultRecurrences</code> array. Check plugin configuration.
          </Text>
        </Feedback>
      ) : (
        <Select onChange={handleChange} value={currentValue?.rrule}>
          <option value="">Doesn't repeat</option>
          {availableRecurrences.map((recurrence) => {
            if (!recurrence) {
              return null
            }
            const rule = rrulestr(recurrence)

            return (
              <option key={recurrence} value={recurrence}>
                {upperFirst(rule.toText())}
              </option>
            )
          })}
          {!hideCustom && <option value="custom">Custom...</option>}
        </Select>
      )}
      {rruleMember && <ObjectInputMember member={rruleMember} {...renderProps} />}
      <CustomRule
        open={open}
        onClose={onClose}
        onChange={onChange}
        initialValue={currentValue?.rrule}
        startDate={
          startDateMember?.kind == 'field' ? (startDateMember?.field?.value as string) : undefined
        }
        dateTimeOptions={dateTimeOptions}
      />
    </Stack>
  )
}
