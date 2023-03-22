import { EnumMembershipStatus } from '@lib/enums'
import { removeEmptyFields } from '@lib/utils'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntityAPI } from './base.entity'
import { PlanEntity } from './plan.entity'
import { TeamEntity } from './team.entity'
import { UserEntity } from './user.entity'

interface Team {
  id: string
  name: string
}

interface Plan {
  id: string
  name: string
  value: number
}

interface User {
  id: string
  name: string
}

export class MembershipPayload {
  constructor(init?: Partial<MembershipPayload>) {
    Object.assign(this, init)
  }

  @ApiProperty()
  id: string

  @ApiProperty()
  team: Team

  @ApiProperty()
  plan: Plan

  @ApiProperty()
  user: User

  @ApiProperty()
  registrationDate: Date

  @ApiProperty()
  status: string

  @ApiProperty()
  paymentId: number

  @ApiProperty()
  dueDate: Date

  @ApiPropertyOptional()
  createdAt?: Date

  @ApiPropertyOptional()
  updatedAt?: Date
}

@Entity({ name: 'membership' })
export class MembershipEntity extends BaseEntityAPI {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'plan_id', type: 'uuid' })
  planId: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @Column({ name: 'team_id', type: 'uuid' })
  teamId: string

  @Column({ name: 'payment_id', type: 'int' })
  paymentId: number

  @Column({ type: 'enum', enum: EnumMembershipStatus })
  status: EnumMembershipStatus

  @Column({ name: 'payment_method' })
  paymentMethod: string

  @Column({
    name: 'registration_date',
    type: 'timestamp with time zone',
    default: () => 'now()',
  })
  registrationDate: Date

  @Column({
    name: 'due_date',
    type: 'timestamp with time zone',
  })
  dueDate: Date

  @ManyToOne(() => UserEntity, (user) => user.memberships)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @ManyToOne(() => PlanEntity)
  @JoinColumn({ name: 'plan_id' })
  plan: PlanEntity

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity

  static convertToPayload = (membership: MembershipEntity): MembershipPayload => {
    return new MembershipPayload(
      removeEmptyFields({
        id: membership.id,
        team: {
          id: membership?.team?.id,
          name: membership?.team?.name,
        },
        plan: {
          id: membership?.plan?.id,
          name: membership?.plan?.name,
          value: membership?.plan?.price,
        },
        user: {
          id: membership?.user?.id,
          name: membership?.user?.name,
        },
        registrationDate: membership.registrationDate,
        status: membership?.status,
        paymentId: membership?.paymentId,
        dueDate: membership.dueDate,
        createdAt: membership.createdAt,
        updatedAt: membership.updatedAt,
      }),
    )
  }
}
