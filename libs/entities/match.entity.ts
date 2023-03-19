import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntityAPI } from './base.entity'
import { CheckinEntity } from './checkin.entity'
import { StadiumEntity } from './stadium.entity'
import { TeamEntity } from './team.entity'

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
}
