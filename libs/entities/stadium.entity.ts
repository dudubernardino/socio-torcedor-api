import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { StadiumSectorEntity } from './stadium-sector.entity'

@Entity({ name: 'stadiums' })
export class StadiumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @OneToMany(() => StadiumSectorEntity, (sector) => sector.stadium)
  sectors: StadiumSectorEntity[]
}
