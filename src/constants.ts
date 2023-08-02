import {PluginConfig, WithRequiredProperty} from './types'

const DEFAULT_RECURRENCES = [
  'RRULE:FREQ=DAILY;INTERVAL=1',
  'RRULE:FREQ=WEEKLY;INTERVAL=1',
  'RRULE:FREQ=MONTHLY;INTERVAL=1',
  'RRULE:FREQ=YEARLY;INTERVAL=1',
]

export const DEFAULT_CONFIG: WithRequiredProperty<PluginConfig, 'defaultRecurrences'> = {
  defaultRecurrences: DEFAULT_RECURRENCES,
}

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const DEFAULT_COUNTS = [
  5, // yearly
  12, // monthly
  12, // weekly
  30, // daily
]
