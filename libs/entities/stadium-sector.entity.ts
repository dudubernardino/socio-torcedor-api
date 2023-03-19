import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntityAPI } from './base.entity'
import { CheckinEntity } from './checkin.entity'
import { StadiumEntity } from './stadium.entity'

@Entity({ name: 'stadiums_sector' })
export class StadiumSectorEntity extends BaseEntityAPI {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'stadium_id', type: 'uuid' })
  stadiumId: string

  @Column()
  name: string

  @Column({ type: 'int' })
  capacity: number

  @Column({ name: 'checkin_limit', type: 'int' })
  checkinLimit: number

  @ManyToOne(() => StadiumEntity)
  @JoinColumn({ name: 'stadium_id' })
  stadium: StadiumEntity

  @OneToMany(() => CheckinEntity, (checkin) => checkin.sector)
  checkins: CheckinEntity[]
}
