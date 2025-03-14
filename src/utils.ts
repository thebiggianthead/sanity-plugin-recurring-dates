import {rrulestr} from 'rrule'

export const validateRRuleString = (recurrence: string): boolean => {
  try {
    rrulestr(recurrence)
    return false
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return true
  }
}

export const validateRRuleStrings = (recurrences: string[]): boolean => {
  return recurrences.some((recurrence) => {
    return validateRRuleString(recurrence)
  })
}
