import { DatabaseModule } from '@lib/database'
import { CheckinEntity, MatchEntity, MembershipEntity } from '@lib/entities'
import { JWTModule, JwtStrategy } from '@lib/jwt'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CheckinController } from './checkin.controller'
import { CheckinsService } from './checkin.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    JWTModule,
    TypeOrmModule.forFeature([CheckinEntity, MatchEntity, MembershipEntity]),
  ],
  controllers: [CheckinController],
  providers: [CheckinsService, JwtStrategy],
})
export class CheckinsModule {}
