import { UserEntity } from '@lib/entities'
import { JWTService } from '@lib/jwt'
import { eres } from '@lib/utils'
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'
import { AuthOutputDto } from './dtos/auth-output.dto'
import { AuthDto } from './dtos/auth.dto'

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name)

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JWTService,
  ) {}

  private signAccessToken(payload) {
    return this.jwtService.sign({ payload })
  }

  private async findUser(filter: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    const [error, user] = await eres(
      this.userRepository.findOne({
        where: { ...filter },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
        },
      }),
    )

    if (error) throw new UnprocessableEntityException('User not found or password is not valid.')

    return user
  }

  async basicCheck({ email, password }: AuthDto) {
    const user = await this.findUser({ email })

    const [error, isValid] = await eres(user.validatePassword(password))

    if (error) {
      this.logger.error(error)
      throw new UnprocessableEntityException('User not found or password is not valid.')
    }

    if (!isValid) {
      throw new UnprocessableEntityException('User not found or password is not valid.')
    }
    return user
  }

  async login(authInput: AuthDto): Promise<AuthOutputDto> {
    const user = await this.basicCheck(authInput)

    const accessToken = await this.signAccessToken(user)

    return { accessToken }
  }
}
