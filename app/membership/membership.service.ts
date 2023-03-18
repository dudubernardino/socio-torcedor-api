import { MembershipEntity } from '@lib/entities'
import { EnumMembershipStatus } from '@lib/enums'
import { eres } from '@lib/utils'
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class MembershipService {
  private readonly logger = new Logger(MembershipService.name)

  constructor(
    @InjectRepository(MembershipEntity)
    private readonly membershipRepository: Repository<MembershipEntity>,
  ) {}

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
