import {defineField} from 'sanity'

import {RecurringDates} from '../components/RecurringDate'
import {PluginConfig, WithRequiredProperty} from '../types'

export default (config: WithRequiredProperty<PluginConfig, 'defaultRecurrences'>) => {
  const {hideEndDate, dateTimeOptions} = config

  return defineField({
    name: 'recurringDates',
    title: 'Dates',
    type: 'object',
    fields: [
      defineField({
        title: 'Start Date',
        name: 'startDate',
        type: 'datetime',
        options: dateTimeOptions,
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        title: 'End Date',
        name: 'endDate',
        type: 'datetime',
        options: dateTimeOptions,
        validation: (Rule) => Rule.min(Rule.valueOfField('startDate')),
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
    ].filter((field) => !(field.name === 'endDate' && hideEndDate)),
    components: {
      input: (props) => RecurringDates({...props, pluginConfig: config}),
    },
  })
}
