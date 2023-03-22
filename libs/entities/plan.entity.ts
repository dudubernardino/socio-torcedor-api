import { removeEmptyFields } from '@lib/utils'
import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntityAPI } from './base.entity'
import { MembershipEntity } from './membership.entity'
import { StadiumSectorEntity } from './stadium-sector.entity'
import { TeamEntity } from './team.entity'

export class PlanPayload {
  constructor(init?: Partial<PlanPayload>) {
    Object.assign(this, init)
  }

  @ApiProperty()
  id: string

  @ApiProperty()
  price: number

  @ApiProperty()
  createdAt: Date

  @ApiProperty({ required: false })
  updatedAt?: Date
}

@Entity({ name: 'plans' })
export class PlanEntity extends BaseEntityAPI {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ name: 'team_id', type: 'uuid', nullable: true })
  teamId: string

  @Column({ nullable: true })
  description?: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @OneToMany(() => MembershipEntity, (membership) => membership.plan)
  memberships: MembershipEntity[]

  @ManyToMany(() => StadiumSectorEntity)
  @JoinTable()
  sectors: StadiumSectorEntity[]

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity

  static convertToPayload = (plan: PlanEntity): PlanPayload => {
    return new PlanPayload(
      removeEmptyFields({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        sectors: plan?.sectors?.map((sector) => ({
          id: sector?.id,
          name: sector?.name,
        })),
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      }),
    )
  }
}
