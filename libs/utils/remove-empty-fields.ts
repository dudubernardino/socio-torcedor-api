import { JSONStringify } from './json'

const isObject = (value: unknown): value is object => {
  return value != null && (typeof value === 'object' || typeof value === 'function') && !Array.isArray(value)
}

const isDate = (value: unknown): boolean => {
  return value instanceof Date && !isNaN(value.getTime())
}

export const removeEmptyFields = <T>(obj: T): Partial<T> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (isObject(value) && !isDate(value) && Object.keys(value).length === 0) return acc
    if (value === null || value === '' || value === undefined) return acc

    const parsedValue = isObject(value) && !isDate(value) ? removeEmptyFields(value) : value

    if (JSONStringify(parsedValue) === '{}') return acc

    return {
      ...acc,
      [key]: parsedValue,
    }
  }, {})
}
