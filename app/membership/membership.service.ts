import { MembershipEntity, MembershipPayload } from '@lib/entities'
import { EnumMembershipStatus } from '@lib/enums'
import { MercadoPagoService } from '@lib/mercado-pago/mercado-pago.service'
import { addOneYear, eres } from '@lib/utils'
import { Inject, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PlansService } from 'app/plans/plans.service'
import { match } from 'ts-pattern'
import { Repository } from 'typeorm'
import { CreateMembershipDto } from './dtos/create-membership.dto'
import { FilterMembershipDto } from './dtos/filter-membership.dto'
import { FilterMembershipOutputDto } from './dtos/find-membership.output.dto'

@Injectable()
export class MembershipService {
  private readonly logger = new Logger(MembershipService.name)

  constructor(
    @InjectRepository(MembershipEntity)
    private readonly membershipRepository: Repository<MembershipEntity>,
    @Inject(MercadoPagoService)
    private readonly mercadoPagoService: MercadoPagoService,
    @Inject(PlansService)
    private readonly plansService: PlansService,
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

  async findMembershipById(data: FilterMembershipDto): Promise<MembershipEntity> {
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

    return membership
  }

  private getPaymentStatus(status): EnumMembershipStatus {
    return match(status)
      .with('pending', () => EnumMembershipStatus.PENDING)
      .with('approved', () => EnumMembershipStatus.ACTIVE)
      .with('cancelled', () => EnumMembershipStatus.CANCELED)
      .with('rejected', () => EnumMembershipStatus.REJECTED)
      .otherwise(() => EnumMembershipStatus.INACTIVE)
  }

  async create(data: CreateMembershipDto): Promise<MembershipPayload> {
    await this.checkMembershipBasics(data)

    const { price, description } = await this.plansService.findPlanById(data.teamId, data.planId)

    const { id, status, payment_type_id } = await this.mercadoPagoService.createPayment(Number(price), description)

    const newMembership = this.membershipRepository.create({
      ...data,
      status: this.getPaymentStatus(status),
      paymentMethod: payment_type_id,
      paymentId: id,
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

    return MembershipEntity.convertToPayload(membership)
  }

  async findAll(): Promise<FilterMembershipOutputDto[]> {
    const query = this.membershipRepository
      .createQueryBuilder('membership')
      .innerJoin('membership.team', 'team')
      .andWhere('membership.status = :status', { status: EnumMembershipStatus.ACTIVE })
      .select('team.id as id, team.name as name, COUNT(membership.id) as memberships')
      .groupBy('team.id')

    const [error, memberships] = await eres(query.getRawMany())

    if (error) {
      this.logger.error(`${MembershipService.name}[findAll]`, error)

      throw new UnprocessableEntityException('Something went wrong while trying to get all membership.')
    }

    return memberships
  }

  async activeMembershipCount(teamId: string): Promise<{ memberships: string }> {
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
