import { removeEmptyFields } from '@lib/utils'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntityAPI } from './base.entity'
import { CheckinEntity } from './checkin.entity'
import { StadiumEntity } from './stadium.entity'
import { TeamEntity } from './team.entity'

class Stadium {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string
}

class Checkins {
  @ApiProperty()
  id: string

  @ApiProperty()
  userId: string
}

export class MatchPayload {
  constructor(init?: Partial<MatchPayload>) {
    Object.assign(this, init)
  }

  @ApiProperty()
  id: string

  @ApiProperty()
  stadium: Stadium

  @ApiProperty({ isArray: true })
  checkins: Checkins[]

  @ApiProperty()
  homeTeam: string

  @ApiPropertyOptional()
  homeTeamScore: number

  @ApiProperty()
  awayTeam: string

  @ApiPropertyOptional()
  awayTeamScore: number

  @ApiProperty()
  startTime: Date

  @ApiProperty()
  createdAt: Date

  @ApiPropertyOptional()
  updatedAt?: Date
}

@Entity({ name: 'matches' })
export class MatchEntity extends BaseEntityAPI {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'stadium_id', type: 'uuid' })
  stadiumId: string

  @Column({ name: 'team_id', type: 'uuid' })
  teamId: string

  @Column({ name: 'home_team' })
  homeTeam: string

  @Column({ name: 'home_team_score', nullable: true, type: 'int' })
  homeTeamScore?: number

  @Column({ name: 'away_team' })
  awayTeam: string

  @Column({ name: 'away_team_score', nullable: true, type: 'int' })
  awayTeamScore?: number

  @Column({ name: 'start_time', type: 'timestamp with time zone' })
  startTime: Date

  @ManyToOne(() => StadiumEntity)
  @JoinColumn({ name: 'stadium_id' })
  stadium: StadiumEntity

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity

  @OneToMany(() => CheckinEntity, (checkin) => checkin.match)
  checkins: CheckinEntity[]

  static convertToPayload = (match: MatchEntity): MatchPayload => {
    return new MatchPayload(
      removeEmptyFields({
        id: match.id,
        homeTeam: match.homeTeam,
        homeTeamScore: match.homeTeamScore,
        awayTeam: match.awayTeam,
        awayTeamScore: match.awayTeamScore,
        startTime: match.startTime,
        stadium: {
          id: match?.stadium?.id,
          name: match?.stadium?.name,
        },
        checkins: match?.checkins?.map((checkin) => ({
          id: checkin.id,
          userId: checkin.userId,
        })),
        createdAt: match.createdAt,
        updatedAt: match.updatedAt,
      }),
    )
  }
}
