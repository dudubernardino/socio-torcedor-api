import { removeEmptyFields } from '@lib/utils'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntityAPI } from './base.entity'

import * as bcrypt from 'bcryptjs'
import { TeamEntity } from './team.entity'

export class ApplicationPayload {
  constructor(init?: Partial<ApplicationPayload>) {
    Object.assign(this, init)
  }

  @ApiProperty()
  id: string

  @ApiProperty()
  teamId: string

  @ApiProperty()
  clientId: string

  @ApiProperty()
  clientSecret: string

  @ApiPropertyOptional()
  description?: string

  @ApiProperty()
  createdAt: Date

  @ApiPropertyOptional()
  updatedAt?: Date
}

@Entity({ name: 'applications' })
export class ApplicationEntity extends BaseEntityAPI {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'team_id', type: 'uuid' })
  teamId: string

  @Column({ nullable: true })
  name?: string

  @Column({ nullable: true })
  description?: string

  @Column()
  clientId: string

  @Column()
  secret: string

  public clientSecret: string

  @Column({ nullable: true })
  salt?: string

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity

  @BeforeInsert()
  async hashPassword() {
    this.clientSecret = this.secret
    this.salt = await bcrypt.genSalt()
    this.secret = await bcrypt.hash(this.secret, this.salt)
  }

  async validatePassword(secret: string): Promise<boolean> {
    return bcrypt.compare(secret ?? '', this.secret)
  }

  static convertToPayload = (application: ApplicationEntity, isScretHidden = true): ApplicationPayload => {
    return new ApplicationPayload(
      removeEmptyFields({
        id: application.id,
        teamId: application.teamId,
        name: application.name,
        clientId: application.clientId,
        secret: isScretHidden ? '********' : application.clientSecret,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      }),
    )
  }
}
