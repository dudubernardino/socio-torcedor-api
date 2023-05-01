import { EntityStatus } from '@lib/enums'
import { maskCpfCnpj, removeEmptyFields } from '@lib/utils'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ApplicationEntity } from './applications.entity'
import { BaseEntityAPI } from './base.entity'
import { UserEntity } from './user.entity'

export class TeamPayload {
  constructor(init?: Partial<TeamPayload>) {
    Object.assign(this, init)
  }

  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiPropertyOptional()
  tradeName?: string

  @ApiProperty()
  email: string

  @ApiProperty()
  status: string

  @ApiPropertyOptional()
  mainColor?: string

  @ApiPropertyOptional()
  avatar?: string

  @ApiPropertyOptional()
  taxId: string

  @ApiPropertyOptional()
  fee?: number

  @ApiPropertyOptional()
  description?: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty({ required: false })
  updatedAt?: Date

  @ApiProperty({ required: false })
  deletedAt?: Date
}

@Entity({ name: 'teams' })
export class TeamEntity extends BaseEntityAPI {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ name: 'trade_name', nullable: true })
  tradeName?: string

  @Column({ unique: true })
  email: string

  @Column({ enum: EntityStatus, default: EntityStatus.Active })
  status: string

  @Column({ name: 'main_color', nullable: true })
  mainColor?: string

  @Column({ nullable: true })
  avatar?: string

  @Column({ name: 'tax_id' })
  taxId: string

  @Column({ nullable: false, default: 0 })
  fee?: number

  @Column('text', { nullable: true })
  description?: string

  @OneToMany(() => UserEntity, (user) => user.team)
  users: UserEntity[]

  @OneToMany(() => ApplicationEntity, (applications) => applications.team)
  applications: ApplicationEntity[]

  static convertToPayload = (team: TeamEntity): TeamPayload => {
    return new TeamPayload(
      removeEmptyFields({
        id: team.id,
        name: team.name,
        tradeName: team.tradeName,
        email: team.email,
        status: team.status,
        taxId: maskCpfCnpj(team.taxId),
        mainColor: team.mainColor,
        avatar: team.avatar,
        fee: team.fee,
        users: team.users?.map((user) => ({
          id: user.id,
          name: user.name,
          memberships: user.memberships?.map((membership) => ({
            id: membership.id,
            status: membership.status,
          })),
        })),
        description: team.description,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
        deletedAt: team.deletedAt,
      }),
    )
  }
}
