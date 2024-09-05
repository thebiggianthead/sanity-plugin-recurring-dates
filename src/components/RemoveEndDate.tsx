import {TrashIcon, WarningOutlineIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {upperFirst} from 'lodash'
import {useCallback} from 'react'
import React from 'react'
import {type ObjectInputProps, unset} from 'sanity'

export function RemoveEndDate({
  title,
  onChange,
}: {
  title?: string
  onChange: ObjectInputProps['onChange']
}): React.JSX.Element {
  // Update the RRULE field when the select changes
  const handleUnsetClick = useCallback(() => {
    onChange(unset(['endDate']))
  }, [onChange])

  return (
    <Card padding={4} radius={2} tone="caution" data-ui="Alert">
      <Flex>
        <Box>
          <Text size={1}>
            <WarningOutlineIcon />
          </Text>
        </Box>
        <Stack space={3} flex={1} marginLeft={3}>
          <Text size={1} weight="semibold">
            The {title ? upperFirst(title) : `current`} field has an end date
          </Text>
          <Box>
            <Text as="p" muted size={1}>
              This field has an end date value, but the end date is currently disabled for this
              field.
            </Text>
          </Box>
          <Button
            icon={TrashIcon}
            tone="critical"
            text={<>Remove end date</>}
            onClick={handleUnsetClick}
            width="fill"
          />
        </Stack>
      </Flex>
    </Card>
  )
}
