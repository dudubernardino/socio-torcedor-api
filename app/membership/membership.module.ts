import { DatabaseModule } from '@lib/database'
import { MembershipEntity } from '@lib/entities'
import { JWTModule, JwtStrategy } from '@lib/jwt'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MembershipController } from './membership.controller'
import { MembershipService } from './membership.service'

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, JWTModule, TypeOrmModule.forFeature([MembershipEntity])],
  controllers: [MembershipController],
  providers: [MembershipService, JwtStrategy],
})
export class MembershipModule {}
