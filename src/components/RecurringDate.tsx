import {Box, Flex, Grid, Select, Stack, Text} from '@sanity/ui'
import {upperFirst} from 'lodash'
import React, {useCallback, useState} from 'react'
import {datetime, rrulestr} from 'rrule'
import {
  ObjectInputMember,
  type ObjectInputProps,
  type ObjectSchemaType,
  type Rule,
  set,
} from 'sanity'
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

export function RecurringDates(props: RecurringDatesProps): React.JSX.Element {
  const {onChange, members, value: currentValue, schemaType, pluginConfig} = props
  const {options, title}: RecurringDateObjectSchemaType = schemaType
  const {defaultRecurrences, hideEndDate, hideCustom, dateTimeOptions, dateOnly, validation} = {
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

    // Ensure the right schemaType is set
    if (dateOnly === true) {
      startDateMember.field.schemaType.name = 'date'
    } else {
      startDateMember.field.schemaType.name = 'datetime'
    }

    // Add custom validation to the start date field
    if (validation?.startDate) {
      startDateMember.field.schemaType.validation = (CustomValidation) =>
        validation?.startDate?.(CustomValidation) as Rule
    } else {
      startDateMember.field.schemaType.validation = (DefaultRule) => DefaultRule.required() as Rule
    }

    // Add custom title to the start date field
    if (options?.fieldTitles?.startDate) {
      startDateMember.field.schemaType.title = options.fieldTitles.startDate
    }

    // Add custom description to the start date field
    if (options?.fieldDescriptions?.startDate) {
      startDateMember.field.schemaType.description = options.fieldDescriptions.startDate
    }
  }

  if (endDateMember?.kind == 'field') {
    endDateMember.field.schemaType.options = {
      ...endDateMember?.field?.schemaType.options,
      ...dateTimeOptions,
    }

    // Ensure the right schemaType is set
    if (dateOnly === true) {
      endDateMember.field.schemaType.name = 'date'
    } else {
      endDateMember.field.schemaType.name = 'datetime'
    }

    // Add custom validation to the end date field
    if (validation?.endDate) {
      endDateMember.field.schemaType.validation = (CustomValidation) =>
        validation?.endDate?.(CustomValidation) as Rule
    } else {
      endDateMember.field.schemaType.validation = (DefaultRule) =>
        DefaultRule.min(DefaultRule.valueOfField('startDate')) as Rule
    }

    // Add custom title to the end date field
    if (options?.fieldTitles?.endDate) {
      endDateMember.field.schemaType.title = options.fieldTitles.endDate
    }

    // Add custom description to the end date field
    if (options?.fieldDescriptions?.endDate) {
      endDateMember.field.schemaType.description = options.fieldDescriptions.endDate
    }
  }

  // Do we have an end date set for this field?
  const hasEndDate = currentValue?.endDate

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
          <option value="">Doesn&#39;t repeat</option>
          {availableRecurrences.map((recurrence) => {
            if (!recurrence) {
              return null
            }
            const rule = rrulestr(recurrence)

            rule.options.until =
              rule?.options?.until &&
              datetime(
                rule?.options?.until?.getFullYear(),
                rule?.options?.until?.getMonth() + 1,
                rule?.options?.until?.getDate(),
                rule?.options?.until?.getHours(),
                rule?.options?.until?.getMinutes(),
                rule?.options?.until?.getSeconds(),
              )

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
        endDate={
          endDateMember?.kind == 'field' ? (endDateMember?.field?.value as string) : undefined
        }
        dateTimeOptions={dateTimeOptions}
      />
    </Stack>
  )
}
