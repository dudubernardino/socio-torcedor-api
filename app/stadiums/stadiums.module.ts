import { DatabaseModule } from '@lib/database'
import { StadiumEntity } from '@lib/entities'
import { JWTModule, JwtStrategy } from '@lib/jwt'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StadiumsController } from './stadiums.controller'
import { StadiumsService } from './stadiums.service'

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, JWTModule, TypeOrmModule.forFeature([StadiumEntity])],
  controllers: [StadiumsController],
  providers: [StadiumsService, JwtStrategy],
})
export class StadiumsModule {}
