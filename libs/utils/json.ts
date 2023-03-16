import { Logger } from '@nestjs/common'

export interface JSONStringifyOptions {
  toString: boolean
}

const getCircularReplacer: () => (this: any, key: string, value: any) => any = () => {
  const seen = new WeakSet()
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]'
      }
      seen.add(value)
    }
    return value
  }
}

export const JSONStringify = (json, options?: JSONStringifyOptions) => {
  if (typeof json === 'string') {
    return json
  }

  const logger = new Logger('JSONStringify')

  try {
    return JSON.stringify(json, getCircularReplacer())
  } catch (error) {
    logger.verbose(json, `Error on JSON stringify, returning raw value`)
    return options?.toString ? json.toString() : json
  }
}
