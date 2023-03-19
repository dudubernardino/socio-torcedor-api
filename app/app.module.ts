import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { MatchesModule } from './matches/matches.module'
import { MembershipModule } from './membership/membership.module'
import { PlansModule } from './plans/plans.module'
import { StadiumsModule } from './stadiums/stadiums.module'
import { TeamsModule } from './teams/teams.module'

import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    PlansModule,
    TeamsModule,
    MembershipModule,
    StadiumsModule,
    MatchesModule,
  ],
})
export class AppModule {}
