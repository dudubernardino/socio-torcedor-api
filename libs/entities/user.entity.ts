import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntityAPI } from './base.entity'

@Entity({ name: 'users' })
export class UserEntity extends BaseEntityAPI {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ nullable: false, unique: true })
  email: string

  @Column()
  secret: string
}
