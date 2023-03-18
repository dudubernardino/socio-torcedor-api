import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { CheckinEntity } from './checkin.entity'
import { StadiumEntity } from './stadium.entity'

@Entity({ name: 'stadiums_sector' })
export class StadiumSectorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ type: 'int' })
  capacity: number

  @Column({ name: 'checkin_limit', type: 'int' })
  checkinLimit: number

  @ManyToOne(() => StadiumEntity, (stadium) => stadium.sectors)
  stadium: StadiumEntity

  @OneToMany(() => CheckinEntity, (checkin) => checkin.sector)
  checkins: CheckinEntity[]
}
