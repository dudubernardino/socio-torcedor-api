import { UserEntity } from '@lib/entities'
import { eres } from '@lib/utils'
import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserInputDto } from './dtos/create-user.dto'
import { UpdateUserInputDto } from './dtos/update-user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private async findUserByEmailOrCpfCnpj(email: string, cpfCnpj?: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email', { email })
      .orWhere('users.cpfCnpj = :cpfCnpj', { cpfCnpj })
      .select('users.id')
      .getOne()
  }

  async create(data: UserInputDto): Promise<UserEntity> {
    const user = await this.findUserByEmailOrCpfCnpj(data.email, data.cpfCnpj)

    if (user) throw new UnprocessableEntityException('User already exists.')

    const newUser = this.userRepository.create(data)

    const [error, result] = await eres(newUser.save())

    if (error) throw new InternalServerErrorException('Something went wrong when trying to create a new user.')

    return result
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find()

    return users
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } })

    return user
  }

  private async updateUserBasicCheck(email: string) {
    const userAlreadyExists = await this.findUserByEmailOrCpfCnpj(email)

    if (userAlreadyExists) throw new UnprocessableEntityException('User already exists.')
  }

  async update(userId: string, data: UpdateUserInputDto) {
    await this.updateUserBasicCheck(data.email)

    const user = await this.userRepository.findOne({ where: { id: userId } })

    const updatedUser = this.userRepository.merge(user, data)

    const [error, result] = await eres(this.userRepository.save(updatedUser))

    if (error) throw new InternalServerErrorException('Something went wrong when trying to update user.')

    return result
  }
}
