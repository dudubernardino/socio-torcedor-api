import { UserEntity } from '@lib/entities'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserInputDto } from './dtos/create-user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(data: UserInputDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email: data.email } })

    if (user) throw new UnprocessableEntityException('User already exists.')

    const newUser = this.userRepository.create(data)

    await newUser.save()

    return newUser
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find()

    return users
  }
}
