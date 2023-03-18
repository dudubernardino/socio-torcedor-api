import { format, parseISO } from 'date-fns'

export const formatDate = (date: any): string => {
  if (!date) return

  const parsedDate = parseISO(date)

  return format(parsedDate, 'dd/MM/yyyy')
}
