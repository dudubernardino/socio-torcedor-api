import { removeEmptyFields } from '@lib/utils'
import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntityAPI } from './base.entity'
import { MatchEntity } from './match.entity'
import { StadiumSectorEntity } from './stadium-sector.entity'

interface Sectors {
  id: string
  name: string
  capacity: number
  checkinLimit: number
}

export class StadiumPayload {
  constructor(init?: Partial<StadiumPayload>) {
    Object.assign(this, init)
  }

  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  sectors: Sectors[]

  @ApiProperty()
  createdAt: Date

  @ApiProperty({ required: false })
  updatedAt?: Date
}

@Entity({ name: 'stadiums' })
export class StadiumEntity extends BaseEntityAPI {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @OneToMany(() => StadiumSectorEntity, (sector) => sector.stadium)
  sectors: StadiumSectorEntity[]

  @OneToMany(() => MatchEntity, (match) => match.stadium)
  matches: MatchEntity[]

  static convertToPayload = (stadium: StadiumEntity): StadiumPayload => {
    return new StadiumPayload(
      removeEmptyFields({
        id: stadium.id,
        name: stadium.name,
        sectors: stadium.sectors.map((sector) => ({
          id: sector.id,
          name: sector.name,
          capacity: sector.capacity,
          checkinLimit: sector.checkinLimit,
        })),
        createdAt: stadium.createdAt,
        updatedAt: stadium.updatedAt,
      }),
    )
  }
}
