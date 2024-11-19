import {DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT, format} from '@sanity/util/legacyDateFormat'
import {upperFirst} from 'lodash'
import React from 'react'
import {datetime, rrulestr} from 'rrule'
import type {ObjectSchemaType, PreviewProps} from 'sanity'

import type {PluginConfig, RecurringDate, WithRequiredProperty} from '../types'

type CastPreviewProps = PreviewProps &
  RecurringDate & {
    pluginConfig: WithRequiredProperty<PluginConfig, 'defaultRecurrences'>
  }

type RecurringDateObjectSchemaType = Omit<ObjectSchemaType, 'options'> & {
  options?: PluginConfig
}

export function RecurringDatesPreview(props: CastPreviewProps): React.JSX.Element {
  const {startDate, endDate, rrule, schemaType, pluginConfig} = props
  const options: RecurringDateObjectSchemaType = schemaType?.options

  const {dateTimeOptions, dateOnly} = {
    ...pluginConfig,
    ...options,
  }

  const rule = rrule && rrulestr(rrule)

  if (rule) {
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
  }

  const dateFormat = dateTimeOptions?.dateFormat || DEFAULT_DATE_FORMAT
  const timeFormat = dateTimeOptions?.timeFormat || DEFAULT_TIME_FORMAT

  const start = startDate ? new Date(startDate) : undefined
  const end = endDate ? new Date(endDate) : undefined
  const sameDay = start && end && start.toDateString() === end.toDateString()

  let title = 'No start date'
  if (dateOnly) {
    title = start ? format(start, dateFormat) : 'No start date'
    if (end && !sameDay) {
      title += ` - ${format(end, dateFormat)}`
    }
  } else {
    title = start ? format(start, `${dateFormat} ${timeFormat}`) : 'No start date'
    if (end) {
      title += ` - ${format(end, sameDay ? timeFormat : `${dateFormat} ${timeFormat}`)}`
    }
  }

  const previewProps = {
    title,
    subtitle: rule && upperFirst(rule.toText()),
  }

  return props.renderDefault({...previewProps, ...props})
}
