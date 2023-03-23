import { maskCpfCnpj, removeEmptyFields } from '@lib/utils'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntityAPI } from './base.entity'
import { MatchEntity } from './match.entity'
import { StadiumSectorEntity } from './stadium-sector.entity'
import { UserEntity } from './user.entity'

class User {
  id: string
  name: string
  taxId: string
}

class Match {
  id: string
  homeTeam: string
  homeTeamScore: number
  awayTeam: string
  awayTeamScore: number
  startTime: Date
}

class Sector {
  id: string
  name: string
}

export class CheckinPayload {
  constructor(init?: Partial<CheckinPayload>) {
    Object.assign(this, init)
  }

  @ApiProperty()
  id: string

  @ApiPropertyOptional()
  user?: User

  @ApiPropertyOptional()
  match?: Match

  @ApiPropertyOptional()
  sector?: Sector

  @ApiProperty()
  checkinTime: Date

  @ApiProperty()
  createdAt: Date

  @ApiPropertyOptional()
  updatedAt?: Date
}

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
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @ManyToOne(() => StadiumSectorEntity, (sector) => sector.checkins)
  @JoinColumn({ name: 'sector_id' })
  sector: StadiumSectorEntity

  @ManyToOne(() => MatchEntity, (match) => match.checkins)
  @JoinColumn({ name: 'match_id' })
  match: MatchEntity

  static convertToPayload = (checkin: CheckinEntity, isTaxIdHidden = true): CheckinPayload => {
    return new CheckinPayload(
      removeEmptyFields({
        id: checkin.id,
        user: {
          id: checkin?.user?.id,
          name: checkin?.user?.name,
          taxId: isTaxIdHidden ? maskCpfCnpj(checkin?.user?.taxId) : checkin?.user?.taxId,
        },
        match: {
          id: checkin?.match?.id,
          homeTeam: checkin?.match?.homeTeam,
          homeTeamScore: checkin?.match?.homeTeamScore,
          awayTeam: checkin?.match?.awayTeam,
          awayTeamScore: checkin?.match?.awayTeamScore,
          startTime: checkin?.match?.startTime,
        },
        sector: {
          id: checkin?.sector?.id,
          name: checkin?.sector?.name,
        },
        checkinTime: checkin.checkinTime,
        createdAt: checkin.createdAt,
        updatedAt: checkin.updatedAt,
      }),
    )
  }
}
