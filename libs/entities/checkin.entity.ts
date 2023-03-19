import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntityAPI } from './base.entity'
import { MatchEntity } from './match.entity'
import { StadiumSectorEntity } from './stadium-sector.entity'
import { UserEntity } from './user.entity'

@Entity({ name: 'checkins' })
export class CheckinEntity extends BaseEntityAPI {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'sector_id', type: 'uuid' })
  sectorId: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @Column({ name: 'match_id', type: 'uuid' })
  matchId: string

  @Column({ type: 'timestamp with time zone' })
  checkinTime: Date

  @ManyToOne(() => UserEntity, (user) => user.checkins)
  user: UserEntity

  @ManyToOne(() => StadiumSectorEntity, (sector) => sector.checkins)
  sector: StadiumSectorEntity

  @ManyToOne(() => MatchEntity, (match) => match.checkins)
  match: MatchEntity
}
