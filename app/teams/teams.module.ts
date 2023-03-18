import { DatabaseModule } from '@lib/database'
import { ApplicationEntity, TeamEntity } from '@lib/entities'
import { JWTModule, JwtStrategy } from '@lib/jwt'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TeamsController } from './teams.controller'
import { TeamsService } from './teams.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    JWTModule,
    TypeOrmModule.forFeature([TeamEntity, ApplicationEntity]),
  ],
  controllers: [TeamsController],
  providers: [TeamsService, JwtStrategy],
})
export class TeamsModule {}
