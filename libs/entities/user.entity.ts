import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntityAPI } from './base.entity'

import * as bcrypt from 'bcryptjs'
import { formatDate, maskCpfCnpj, removeEmptyFields } from '@lib/utils'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { EnumRoles, EnumGender } from '@lib/enums'

export class UserPayload {
  constructor(init?: Partial<UserPayload>) {
    Object.assign(this, init)
  }

  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  taxId: string

  @ApiProperty()
  birthday: string

  @ApiProperty()
  gender: string

  @ApiPropertyOptional()
  address?: string

  @ApiPropertyOptional()
  complement?: string

  @ApiPropertyOptional()
  neighborhood?: string

  @ApiPropertyOptional()
  number?: string

  @ApiPropertyOptional()
  zipCode?: string

  @ApiPropertyOptional()
  homePhone?: string

  @ApiPropertyOptional()
  workPhone?: string

  @ApiPropertyOptional()
  cellPhone?: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty({ required: false })
  updatedAt?: Date
}

@Entity({ name: 'users' })
export class UserEntity extends BaseEntityAPI {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ name: 'tax_id' })
  taxId: string

  @Column({ type: 'date' })
  birthday: Date

  @Column({ type: 'enum', enum: EnumGender, nullable: false })
  gender: string

  @Column({ type: 'enum', enum: EnumRoles, nullable: false })
  role: EnumRoles

  @Column({ nullable: true })
  address?: string

  @Column({ nullable: true })
  complement?: string

  @Column({ nullable: true })
  neighborhood?: string

  @Column({ nullable: true })
  number?: string

  @Column({ name: 'zip_code', nullable: true })
  zipCode?: string

  @Column({ name: 'home_phone', nullable: true })
  homePhone?: string

  @Column({ name: 'work_phone', nullable: true })
  workPhone?: string

  @Column({ name: 'cell_phone', nullable: true })
  cellPhone?: string

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password ?? '', this.password)
  }

  static convertToPayload = (user: UserEntity): UserPayload => {
    return new UserPayload(
      removeEmptyFields({
        id: user.id,
        name: user.name,
        email: user.email,
        taxId: maskCpfCnpj(user.taxId),
        birthday: formatDate(user.birthday),
        gender: user.gender,
        address: user.address,
        complement: user.complement,
        neighborhood: user.neighborhood,
        number: user.number,
        zipCode: user.zipCode,
        homePhone: user.homePhone,
        workPhone: user.workPhone,
        cellPhone: user.cellPhone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }),
    )
  }
}
