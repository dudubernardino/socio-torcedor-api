import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntityAPI } from './base.entity'

import * as bcrypt from 'bcryptjs'

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

  @Column({ name: 'cpfCnpj' })
  cpfCnpj: string

  @Column({ name: 'data_nascimento' })
  dataNascimento: Date

  @Column({ nullable: true })
  endereco?: string

  @Column({ nullable: true })
  complemento?: string

  @Column({ nullable: true })
  bairro?: string

  @Column({ nullable: true })
  numero?: string

  @Column({ nullable: true })
  cep?: string

  @Column({ name: 'telefone_residencial', nullable: true })
  telefoneResidencial?: string

  @Column({ name: 'telefone_comercial', nullable: true })
  telefoneComercial?: string

  @Column({ name: 'telefone_celular', nullable: true })
  telefoneCelular?: string

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password ?? '', this.password)
  }
}
