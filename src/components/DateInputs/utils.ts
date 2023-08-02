/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function isValidDate(date: Date) {
  return date instanceof Date && !isNaN(date.valueOf())
}
