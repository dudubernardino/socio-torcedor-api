import { eres } from '@lib/utils'
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import * as mercadopago from 'mercadopago'

@Injectable()
export class MercadoPagoService {
  logger = new Logger(MercadoPagoService.name)

  constructor(private configService: ConfigService) {
    mercadopago.configure({
      access_token: this.configService.get('MERCADO_PAGO_ACCESS_TOKEN'),
    })
  }

  private async getCardToken() {
    const cardData = {
      card_number: '5031433215406351',
      expiration_month: 11,
      expiration_year: 2025,
      security_code: '123',
      cardholder: {
        name: 'APRO',
        identification: {
          type: 'CPF',
          number: '12345678909',
        },
      },
    }

    const [error, result] = await eres<{ response: { id: string } }>(mercadopago.card_token.create(cardData))

    if (error) {
      this.logger.error(`${MercadoPagoService.name}[getCardToken]`, error)
      throw new InternalServerErrorException('Something went wrong, verify your credit card.')
    }

    return result?.response?.id
  }

  async createPayment(value: number, description: string) {
    const cardToken = await this.getCardToken()

    const paymentData = {
      transaction_amount: value,
      token: cardToken,
      description: description || 'Sócio Torcedor Payment',
      installments: 1,
      payment_method_id: 'master',
      payer: {
        email: 'comprador@teste.com.br',
      },
    }

    const [error, payment] = await eres<{ response: { id: number; status: string; payment_type_id: string } }>(
      mercadopago.payment.save(paymentData),
    )

    if (error) {
      this.logger.error(`${MercadoPagoService.name}[create]`, error)
      throw new InternalServerErrorException('Something went wrong, verify your credit card.')
    }

    const { id, status, payment_type_id } = payment?.response

    return { id, status, payment_type_id }
  }

  async getPayment(paymentId: number) {
    const [error, payment] = await eres(mercadopago.payment.get(paymentId))

    if (error) throw new InternalServerErrorException('Payment not found.')

    return payment
  }
}
