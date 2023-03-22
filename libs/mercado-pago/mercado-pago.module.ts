import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MercadoPagoService } from './mercado-pago.service'

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService],
})
export class MercadoPagoModule {}
