import { cpf as cpfValidator } from 'cpf-cnpj-validator'

export const maskData = (item: string) => {
  if (!item) return null

  return item.replace(/./g, '*')
}

export const maskCpfCnpj = (taxId: string) => {
  if (!taxId) return null

  return cpfValidator.isValid(taxId) ? taxId.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.***-$4') : taxId
}
