import { DatabaseModule } from '@lib/database'
import { MembershipEntity } from '@lib/entities'
import { JWTModule, JwtStrategy } from '@lib/jwt'
import { MercadoPagoModule } from '@lib/mercado-pago'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlansModule } from 'app/plans/plans.module'
import { MembershipController } from './membership.controller'
import { MembershipService } from './membership.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    JWTModule,
    MercadoPagoModule,
    PlansModule,
    TypeOrmModule.forFeature([MembershipEntity]),
  ],
  controllers: [MembershipController],
  providers: [MembershipService, JwtStrategy],
})
export class MembershipModule {}
