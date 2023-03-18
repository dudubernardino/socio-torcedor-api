import { addYears, format, parseISO } from 'date-fns'

export const formatDate = (date: any): string => {
  if (!date) return

  const parsedDate = parseISO(date)

  return format(parsedDate, 'dd/MM/yyyy')
}

export const addOneYear = (date: Date) => {
  return addYears(date, 1)
}
