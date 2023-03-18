import { ApplicationEntity, UserEntity } from '@lib/entities'
import { EntityStatus, EnumRoles } from '@lib/enums'
import { JWTService } from '@lib/jwt'
import { eres, removeEmptyFields } from '@lib/utils'
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'
import { AuthAppDto } from './dtos/auth-app-dto'
import { AuthOutputDto } from './dtos/auth-output.dto'
import { AuthDto } from './dtos/auth.dto'

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name)

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
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
          teamId: true,
          name: true,
          email: true,
          password: true,
          role: true,
        },
      }),
    )

    if (error || !user) throw new UnprocessableEntityException('User not found or password is not valid.')

    return user
  }

  async basicCheck({ email, password }: AuthDto): Promise<UserEntity> {
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

    const payload = {
      id: user.id,
      teamId: user.teamId,
      name: user.name,
      role: user.role,
    }

    const accessToken = await this.signAccessToken(payload)

    return { accessToken }
  }

  private async findTeamApplication(filter: FindOptionsWhere<ApplicationEntity>): Promise<ApplicationEntity> {
    const [error, application] = await eres(
      this.applicationRepository.findOne({
        where: { ...filter },
        relations: ['team'],
        withDeleted: true,
        select: {
          id: true,
          name: true,
          clientId: true,
          secret: true,
          description: true,
          teamId: true,
          team: {
            id: true,
            status: true,
          },
        },
      }),
    )

    const isInactive = application?.team?.status === EntityStatus.Inactive

    if (isInactive || error || !application)
      throw new UnprocessableEntityException('Application not found or secret is not valid.')

    return application
  }

  async appBasicCheck({ clientId, secret }: AuthAppDto): Promise<ApplicationEntity> {
    const application = await this.findTeamApplication({ clientId })

    const [error, isValid] = await eres(application.validatePassword(secret))

    if (error) {
      this.logger.error(error)
      throw new UnprocessableEntityException('Team not found or secret is not valid.')
    }

    if (!isValid) {
      throw new UnprocessableEntityException('Team not found or secret is not valid.')
    }
    return application
  }

  async loginApplication(authInput: AuthAppDto): Promise<AuthOutputDto> {
    const application = await this.appBasicCheck(authInput)

    const payload = removeEmptyFields({
      id: application.id,
      teamId: application.teamId,
      name: application.name,
      description: application.description,
      role: EnumRoles.ADMIN,
    })

    const accessToken = await this.signAccessToken(payload)

    return { accessToken }
  }
}
