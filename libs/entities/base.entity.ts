import { BaseEntity, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'

export class BaseEntityAPI extends BaseEntity {
  constructor(base?: any) {
    super()
    Object.assign(this, base)
  }

  id?: any

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'now()',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'now()',
    nullable: true,
  })
  updatedAt?: Date

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date
}
