import type {DatetimeOptions, ObjectDefinition} from 'sanity'

export interface PluginConfig {
  defaultRecurrences?: string[]
  hideEndDate?: boolean
  hideCustom?: boolean
  dateTimeOptions?: DatetimeOptions
}

export type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property]
}

// create a new schema definition based on object (we remove the ability to assign field, change the type add some options)
export type RecurringDateFieldOptions = Omit<ObjectDefinition, 'type' | 'fields'> & {
  type: 'recurringDates'
  options?: PluginConfig
}

// redeclares sanity module so we can add interfaces props to it
declare module 'sanity' {
  // redeclares IntrinsicDefinitions and adds a named definition to it
  // it is important that the key is the same as the type in the definition ('magically-added-type')
  export interface IntrinsicDefinitions {
    recurringDates: RecurringDateFieldOptions
  }
}

export interface RecurringDate {
  rrule: string
  startDate: string
  endDate: String
}
