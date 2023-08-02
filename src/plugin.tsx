import {definePlugin} from 'sanity'

import {DEFAULT_CONFIG} from './constants'
import recurringDateSchema from './schema/recurringDates'
import {PluginConfig, WithRequiredProperty} from './types'

export const recurringDates = definePlugin<PluginConfig>((config) => {
  const pluginConfig: WithRequiredProperty<PluginConfig, 'defaultRecurrences'> = {
    ...DEFAULT_CONFIG,
    ...config,
  }

  return {
    name: 'sanity-plugin-recurring-dates',
    schema: {
      types: [recurringDateSchema(pluginConfig)],
    },
  }
})
