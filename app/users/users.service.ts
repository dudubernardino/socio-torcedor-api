import { UserEntity, UserPayload } from '@lib/entities'
import { EnumRoles } from '@lib/enums'
import { eres } from '@lib/utils'
import { Injectable, InternalServerErrorException, Logger, UnprocessableEntityException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserInputDto } from './dtos/create-user.dto'
import { UpdateUserInputDto } from './dtos/update-user.dto'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}

  private async findUserByEmailOrTaxId(email: string, taxId?: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email', { email })
      .orWhere('users.taxId = :taxId', { taxId })
      .select('users.id')
      .getOne()
  }

  async createFirstUser(): Promise<boolean> {
    const data = {
      name: this.configService.get('SUPER_ADMIN_NAME'),
      email: this.configService.get('SUPER_ADMIN_EMAIL'),
      password: this.configService.get('SUPER_ADMIN_SECRET'),
      confirmPassword: this.configService.get('SUPER_ADMIN_SECRET'),
      taxId: this.configService.get('SUPER_ADMIN_TAX_ID'),
      role: EnumRoles.SUPER_ADMIN,
    }

    const user = await this.findUserByEmailOrTaxId(data.email, data.taxId)

    if (user) return true

    const newUser = this.userRepository.create(data)

    const [error] = await eres(newUser.save())

    if (error) {
      this.logger.error(`${UsersService.name}[create]`, error)

      return false
    }

    this.logger.log(`${UsersService.name}[create]: Super Admin user it was created.`)

    return true
  }

  async create(data: UserInputDto): Promise<UserPayload> {
    this.logger.log(`${UsersService.name}[create]: User from TeamId: ${data.teamId}`)

    const [findError, user] = await eres(this.findUserByEmailOrTaxId(data.email, data.taxId))

    if (findError || user) throw new UnprocessableEntityException('User already exists.')

    const newUser = this.userRepository.create(data)

    const [error, result] = await eres(newUser.save())

    if (error) {
      this.logger.error(`${UsersService.name}[create]`, error)

      throw new InternalServerErrorException('Something went wrong when trying to create a new user.')
    }

    return UserEntity.convertToPayload(result)
  }

  async findAll(teamId: string): Promise<UserPayload[]> {
    this.logger.log(`${UsersService.name}[findAll]: Users from TeamId: ${teamId}`)

    const query = this.userRepository.createQueryBuilder('users').leftJoinAndSelect('users.team', 'team')

    if (teamId) query.where('users.teamId = :teamId', { teamId })

    const [error, users] = await eres(query.getMany())

    if (error) {
      this.logger.error(`${UsersService.name}[findAll - teamId: ${teamId}]`, error)

      throw new UnprocessableEntityException('Users not found.')
    }

    return users.map((user) => UserEntity.convertToPayload(user))
  }

  private async findUserById(teamId: string, userId: string): Promise<UserEntity> {
    this.logger.log(`${UsersService.name}[findUserById]: User from TeamId: ${teamId}`)

    const query = this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.team', 'team')
      .where('users.id = :id', { id: userId })

    if (teamId) query.andWhere('users.teamId = :teamId', { teamId })

    const [error, user] = await eres(query.getOne())

    if (error || !user) {
      this.logger.error(`${UsersService.name}[findUserById - id: ${userId}]`, error)

      throw new UnprocessableEntityException('User not found.')
    }

    return user
  }

  async findOne(teamId: string, userId: string): Promise<UserPayload> {
    const user = await this.findUserById(teamId, userId)

    return UserEntity.convertToPayload(user)
  }

  private async updateUserBasicCheck(email: string) {
    const userAlreadyExists = await this.findUserByEmailOrTaxId(email)

    if (userAlreadyExists) throw new UnprocessableEntityException('User already exists.')
  }

  async update(teamId: string, userId: string, data: UpdateUserInputDto): Promise<UserPayload> {
    await this.updateUserBasicCheck(data.email)

    const user = await this.findUserById(teamId, userId)

    const updatedUser = this.userRepository.merge(user, data)

    const [error, result] = await eres(this.userRepository.save(updatedUser))

    if (error) {
      this.logger.error(`${UsersService.name}[updateUser - id: ${userId}]`, error)

      throw new InternalServerErrorException('Something went wrong when trying to update user.')
    }

    return UserEntity.convertToPayload(result)
  }

  async remove(teamId: string, userId: string): Promise<boolean> {
    const user = await this.findUserById(teamId, userId)

    const [error] = await eres(this.userRepository.remove(user))

    if (error) throw new InternalServerErrorException('Something went wrong when trying to remove user.')

    return true
  }
}
