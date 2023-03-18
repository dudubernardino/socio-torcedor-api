import { EnumMembershipStatus, EnumPaymentMethods } from '@lib/enums'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntityAPI } from './base.entity'
import { PlanEntity } from './plan.entity'
import { TeamEntity } from './team.entity'
import { UserEntity } from './user.entity'

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

  @Column({ type: 'enum', enum: EnumMembershipStatus })
  status: EnumMembershipStatus

  @Column({ name: 'payment_method', type: 'enum', enum: EnumPaymentMethods })
  paymentMethods: EnumMembershipStatus

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
}
