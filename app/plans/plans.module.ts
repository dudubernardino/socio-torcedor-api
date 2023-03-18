import { DatabaseModule } from '@lib/database'
import { PlanEntity } from '@lib/entities/plan.entity'
import { JWTModule, JwtStrategy } from '@lib/jwt'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlansController } from './plans.controller'
import { PlansService } from './plans.service'

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, JWTModule, TypeOrmModule.forFeature([PlanEntity])],
  controllers: [PlansController],
  providers: [PlansService, JwtStrategy],
})
export class PlansModule {}
