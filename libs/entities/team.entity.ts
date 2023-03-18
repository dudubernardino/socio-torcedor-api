import { maskCpfCnpj, removeEmptyFields } from '@lib/utils'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
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
}

@Entity({ name: 'teams' })
export class TeamEntity extends BaseEntityAPI {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ nullable: true })
  tradeName?: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
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

  static convertToPayload = (team: TeamEntity): TeamPayload => {
    return new TeamPayload(
      removeEmptyFields({
        id: team.id,
        name: team.name,
        tradeName: team.tradeName,
        email: team.email,
        taxId: maskCpfCnpj(team.taxId),
        mainColor: team.mainColor,
        avatar: team.avatar,
        fee: team.fee,
        description: team.description,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
      }),
    )
  }
}
