import { cpf as cpfValidator } from 'cpf-cnpj-validator'

export const maskData = (item: string) => {
  if (!item) return null

  return item.replace(/./g, '*')
}

export const maskCpfCnpj = (cpfCnpj: string) => {
  if (!cpfCnpj) return null

  return cpfValidator.isValid(cpfCnpj) ? cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.***-$4') : cpfCnpj
}
