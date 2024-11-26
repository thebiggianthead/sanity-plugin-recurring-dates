import {CalendarIcon} from '@sanity/icons'
import {defineField, SchemaTypeDefinition} from 'sanity'

import {RecurringDates} from '../components/RecurringDate'
import {RecurringDatesPreview} from '../components/RecurringDatesPreview'
import {PluginConfig, WithRequiredProperty} from '../types'

export default (
  config: WithRequiredProperty<PluginConfig, 'defaultRecurrences'>,
): SchemaTypeDefinition => {
  const {dateTimeOptions, dateOnly, validation, fieldTitles, fieldDescriptions} = config

  return defineField({
    name: 'recurringDates',
    title: 'Dates',
    type: 'object',
    icon: CalendarIcon,
    fields: [
      defineField({
        title: fieldTitles?.startDate || 'Start Date',
        description: fieldDescriptions?.startDate || '',
        name: 'startDate',
        type: dateOnly ? 'date' : 'datetime',
        options: dateTimeOptions,
        validation: (Rule) =>
          validation?.startDate ? validation.startDate(Rule) : Rule.required(),
      }),
      defineField({
        title: fieldTitles?.endDate || 'End Date',
        description: fieldDescriptions?.endDate || '',
        name: 'endDate',
        type: dateOnly ? 'date' : 'datetime',
        options: dateTimeOptions,
        validation: (Rule) =>
          validation?.endDate ? validation.endDate(Rule) : Rule.min(Rule.valueOfField('startDate')),
      }),
      defineField({
        title: 'Recurring event',
        name: 'recurs',
        type: 'boolean',
      }),
      defineField({
        title: 'RRULE',
        name: 'rrule',
        type: 'string',
        hidden: true,
      }),
    ],
    components: {
      input: (props) => RecurringDates({...props, pluginConfig: config}),
      preview: (props) => RecurringDatesPreview({...props, pluginConfig: config}),
    },
    preview: {
      select: {
        startDate: 'startDate',
        endDate: 'endDate',
        rrule: 'rrule',
      },
    },
  })
}
