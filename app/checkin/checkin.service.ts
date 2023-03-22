import { CheckinEntity, MatchEntity, UserEntity } from '@lib/entities'
import { eres } from '@lib/utils'
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateCheckinDto } from './dtos/create-checkin.dto'

@Injectable()
export class CheckinsService {
  logger = new Logger(CheckinsService.name)

  constructor(
    @InjectRepository(CheckinEntity)
    private readonly checkinsRepository: Repository<CheckinEntity>,
    @InjectRepository(MatchEntity)
    private readonly matchesRepository: Repository<MatchEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  private async checkinValidations(teamId: string, data: CreateCheckinDto) {
    const [error, checkin] = await eres(
      this.checkinsRepository.findOne({
        where: {
          userId: data.userId,
          matchId: data.matchId,
        },
      }),
    )

    if (error || checkin) {
      this.logger.error(`${CheckinsService.name}[checkinBasicCheck - teamId: ${teamId}]`, error)
      throw new UnprocessableEntityException('Something went wrong, verify your checkin.')
    }

    const [errorMatch, match] = await eres(
      this.matchesRepository.findOne({
        where: {
          id: data.matchId,
          teamId,
        },
      }),
    )

    if (errorMatch || !match) {
      this.logger.error(`${CheckinsService.name}[checkinBasicCheck - teamId: ${teamId}]`, error)
      throw new UnprocessableEntityException('Something went wrong, we are looking into it.')
    }
  }

  private async userValidations(userId: string) {
    const query = this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.memberships', 'memberships')
      .innerJoinAndSelect('memberships.plan', 'plan')
      .innerJoinAndSelect('plan.sectors', 'sectors')
      .where('users.id = :userId', { userId })
  }

  async checkinBasicCheck(teamId: string, data: CreateCheckinDto) {
    await this.checkinValidations(teamId, data)

    await this.userValidations(data.userId)
  }

  async create(teamId: string, data: CreateCheckinDto) {
    await this.checkinBasicCheck(teamId, data)

    return true
  }
}
