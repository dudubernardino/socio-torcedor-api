import { MembershipEntity, MembershipPayload } from '@lib/entities'
import { EnumMembershipStatus, EnumPaymentMethods } from '@lib/enums'
import { addOneYear, eres } from '@lib/utils'
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateMembershipDto } from './dtos/create-membership.dto'
import { FilterMembershipDto } from './dtos/filter-membership.dto'

@Injectable()
export class MembershipService {
  private readonly logger = new Logger(MembershipService.name)

  constructor(
    @InjectRepository(MembershipEntity)
    private readonly membershipRepository: Repository<MembershipEntity>,
  ) {}

  private async checkMembershipBasics(data: CreateMembershipDto) {
    const [error, membership] = await eres(
      this.membershipRepository.findOne({
        where: { userId: data.userId, teamId: data.teamId, status: EnumMembershipStatus.ACTIVE },
      }),
    )

    if (error || membership) {
      this.logger.error(`${MembershipService.name}[checkMembershipBasics - userId: ${data.userId}]`, error)

      throw new UnprocessableEntityException('Membership already active.')
    }
  }

  async findMembershipById(data: FilterMembershipDto): Promise<MembershipPayload> {
    const [error, membership] = await eres(
      this.membershipRepository.findOne({
        where: { teamId: data.teamId, userId: data.userId, id: data.membershipId },
        relations: ['team', 'user', 'plan'],
      }),
    )

    if (error || !membership) {
      this.logger.error(`${MembershipService.name}[findMembershipById - id: ${data.membershipId}]`, error)

      throw new UnprocessableEntityException('Membership not found.')
    }

    return MembershipEntity.convertToPayload(membership)
  }

  async create(data: CreateMembershipDto): Promise<MembershipPayload> {
    await this.checkMembershipBasics(data)

    const newMembership = this.membershipRepository.create({
      ...data,
      status: EnumMembershipStatus.ACTIVE,
      paymentMethods: EnumPaymentMethods.PIX,
      dueDate: addOneYear(new Date()),
    })

    const [error, result] = await eres(newMembership.save())

    if (error) {
      this.logger.error(`${MembershipService.name}[create]`, error)

      throw new UnprocessableEntityException('Something went wrong while trying to save membership.')
    }

    const membership = await this.findMembershipById({
      teamId: result.teamId,
      userId: result.userId,
      membershipId: result.id,
    })

    return membership
  }

  async activeMembershipCount(teamId: string) {
    const query = this.membershipRepository
      .createQueryBuilder('membership')
      .where('membership.teamId = :teamId', { teamId })
      .andWhere('membership.status = :status', { status: EnumMembershipStatus.ACTIVE })
      .select('COUNT(membership.id)', 'memberships')

    const [error, result] = await eres(query.getRawOne())

    if (error) {
      this.logger.error(`${MembershipService.name}[activeMembershipCount - teamId: ${teamId}]`, error)

      throw new UnprocessableEntityException('Something went wrong while trying to ge memberships.')
    }

    return result
  }
}
