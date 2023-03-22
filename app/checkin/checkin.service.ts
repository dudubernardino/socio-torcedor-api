import { CheckinEntity, MatchEntity, MembershipEntity, UserJwtPayload } from '@lib/entities'
import { eres } from '@lib/utils'
import { Injectable, InternalServerErrorException, Logger, UnprocessableEntityException } from '@nestjs/common'
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
    @InjectRepository(MembershipEntity)
    private readonly membershipsRepository: Repository<MembershipEntity>,
  ) {}

  private async getCheckin(user: UserJwtPayload, matchId: string): Promise<CheckinEntity> {
    const [error, checkin] = await eres(
      this.checkinsRepository.findOne({
        where: {
          userId: user.id,
          matchId,
        },
      }),
    )

    if (error || !checkin) {
      this.logger.error(`${CheckinsService.name}[getCheckin - teamId: ${user.teamId}]`, error)
      throw new UnprocessableEntityException('Something went wrong, verify your checkin.')
    }

    return checkin
  }

  private async getMatch(user: UserJwtPayload, matchId: string): Promise<MatchEntity> {
    const [error, match] = await eres(
      this.matchesRepository.findOne({
        where: {
          id: matchId,
          teamId: user.teamId,
        },
      }),
    )

    if (error || !match) {
      this.logger.error(`${CheckinsService.name}[getMatch - teamId: ${user.teamId}]`, error)
      throw new UnprocessableEntityException('Something went wrong, we are looking into it.')
    }

    return match
  }

  private async checkinValidations(user: UserJwtPayload, data: CreateCheckinDto): Promise<void> {
    const [error, checkin] = await eres(
      this.checkinsRepository.findOne({
        where: {
          userId: user.id,
          matchId: data.matchId,
        },
      }),
    )

    if (error || checkin) {
      this.logger.error(`${CheckinsService.name}[checkinValidations - teamId: ${user.teamId}]`, error)
      throw new UnprocessableEntityException('Something went wrong, verify your checkin.')
    }

    await this.getMatch(user, data.matchId)
  }

  private async membershipValidations(userData: UserJwtPayload, sectorId: string): Promise<void> {
    const query = this.membershipsRepository
      .createQueryBuilder('memberships')
      .innerJoinAndSelect('memberships.plan', 'plan')
      .innerJoinAndSelect('plan.sectors', 'sectors')
      .where('memberships.userId = :userId', { userId: userData.id })
      .andWhere('sectors.id IN (:...ids)', { ids: [sectorId] })
      .select(['memberships.id', 'memberships.userId', 'plan.id', 'sectors.id'])

    const [error, membership] = await eres(query.getOne())

    if (error || !membership) {
      this.logger.error(`${CheckinsService.name}[membershipValidations - teamId: ${userData.teamId}]`, error)
      throw new UnprocessableEntityException('You do not have permission for this sector.')
    }
  }

  async create(user: UserJwtPayload, data: CreateCheckinDto) {
    await this.checkinValidations(user, data)

    await this.membershipValidations(user, data.sectorId)

    const newCheckin = this.checkinsRepository.create({ ...data, userId: user.id, checkinTime: new Date() })

    const [error, checkin] = await eres(newCheckin.save())

    if (error) {
      this.logger.error(`${CheckinsService.name}[create - teamId: ${user.teamId}]`, error)
      throw new UnprocessableEntityException('Something went wrong when trying to create a checkin.')
    }

    return CheckinEntity.convertToPayload(checkin)
  }

  async findAll(matchId: string) {
    const query = this.checkinsRepository
      .createQueryBuilder('checkins')
      .leftJoinAndSelect('checkins.user', 'user')
      .leftJoinAndSelect('checkins.match', 'match')
      .leftJoinAndSelect('checkins.sector', 'sector')
      .where('checkins.matchId = :matchId', { matchId })

    const [error, checkins] = await eres(query.getMany())

    if (error) {
      this.logger.error(`${CheckinsService.name}[findAll - matchId: ${matchId}]`, error)
      throw new UnprocessableEntityException('Something went wrong when trying to find all checkins.')
    }

    return checkins?.map((checkin) => CheckinEntity.convertToPayload(checkin))
  }

  async findOne(user: UserJwtPayload, matchId: string) {
    const checkin = await this.getCheckin(user, matchId)

    return CheckinEntity.convertToPayload(checkin)
  }

  async cancel(user: UserJwtPayload, matchId: string): Promise<boolean> {
    const checkin = await this.getCheckin(user, matchId)

    const [error] = await eres(this.checkinsRepository.remove(checkin))

    if (error) throw new InternalServerErrorException('Something went wrong when trying to canel checkin.')

    return true
  }
}
