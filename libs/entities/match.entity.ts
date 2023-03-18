import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { CheckinEntity } from './checkin.entity'
import { StadiumEntity } from './stadium.entity'

@Entity({ name: 'matches' })
export class MatchEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'stadium_id', type: 'uuid' })
  stadiumId: string

  @Column({ name: 'home_team' })
  homeTeam: string

  @Column({ name: 'away_team' })
  awayTeam: string

  @Column({ name: 'start_time', type: 'timestamp with time zone' })
  startTime: Date

  @ManyToOne(() => StadiumEntity)
  @JoinColumn({ name: 'stadium_id' })
  stadium: StadiumEntity

  @OneToMany(() => CheckinEntity, (checkin) => checkin.match)
  checkins: CheckinEntity[]
}
