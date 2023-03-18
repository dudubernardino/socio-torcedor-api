import { removeEmptyFields } from '@lib/utils'
import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntityAPI } from './base.entity'
import { MembershipEntity } from './membership.entity'

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

  @Column({ nullable: true })
  description?: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @OneToMany(() => MembershipEntity, (membership) => membership.plan)
  memberships: MembershipEntity[]

  static convertToPayload = (plan: PlanEntity): PlanPayload => {
    return new PlanPayload(
      removeEmptyFields({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      }),
    )
  }
}
