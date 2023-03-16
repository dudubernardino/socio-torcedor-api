import { format, parseISO } from 'date-fns'

export const formatDate = (date: any): string => {
  const parsedDate = parseISO(date)

  return format(parsedDate, 'dd/MM/yyyy')
}
