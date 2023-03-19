import { DatabaseModule } from '@lib/database'
import { MatchEntity, TeamEntity } from '@lib/entities'
import { JWTModule, JwtStrategy } from '@lib/jwt'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MatchesController } from './matches.controller'
import { MatchesService } from './matches.service'

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, JWTModule, TypeOrmModule.forFeature([MatchEntity, TeamEntity])],
  controllers: [MatchesController],
  providers: [MatchesService, JwtStrategy],
})
export class MatchesModule {}
