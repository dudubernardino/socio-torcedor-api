import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as SendGrid from '@sendgrid/mail'

@Injectable()
export class EmailsService {
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('SG_TOKEN')

    if (!!apiKey && apiKey.length > 3) {
      SendGrid.setApiKey(apiKey)
    }
  }

  async send(mail: SendGrid.MailDataRequired) {
    const transport = await SendGrid.send(mail)

    console.log(`Email successfully dispatched to ${mail.to}`)
    return transport
  }
}
