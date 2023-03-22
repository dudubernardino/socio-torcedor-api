import { PlanEntity } from '@lib/entities/plan.entity'
import { eres } from '@lib/utils'
import { Injectable, InternalServerErrorException, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { PlanInputDto } from './dtos/create-plan.dto'

import { PlanPayload } from '@lib/entities/plan.entity'
import { UpdatePlanDto } from './dtos/update-plan.dto'
import { StadiumSectorEntity } from '@lib/entities'

@Injectable()
export class PlansService {
  logger = new Logger(PlansService.name)

  constructor(
    @InjectRepository(PlanEntity)
    private readonly plansRepository: Repository<PlanEntity>,
    @InjectRepository(StadiumSectorEntity)
    private readonly sectorsRepository: Repository<StadiumSectorEntity>,
  ) {}

  private async findSectors(sectors: string[]) {
    const [error, sectorResult] = await eres(this.sectorsRepository.find({ where: { id: In(sectors) } }))

    if (error) {
      this.logger.error(`${PlansService.name}[findSectors]`, error)
      throw new UnprocessableEntityException('Sector not found.')
    }

    return sectorResult
  }

  async create(teamId: string, data: PlanInputDto): Promise<PlanPayload> {
    if (!!data?.sectors.length) {
      const sectors = await this.findSectors(data.sectors)
      data.sectors = sectors
    }

    const plan = this.plansRepository.create({ ...data, teamId })

    const [error, result] = await eres(plan.save())

    if (error) {
      this.logger.error(`${PlansService.name}[create]`, error)
      throw new InternalServerErrorException('Something went wrong when trying to create a new plan.')
    }

    return PlanEntity.convertToPayload(result)
  }

  async findAll(teamId: string): Promise<PlanPayload[]> {
    const query = this.plansRepository.createQueryBuilder('plans').leftJoinAndSelect('plans.sectors', 'sectors')

    if (teamId) query.andWhere('plans.teamId = :teamId', { teamId })

    const [error, plans] = await eres(query.getMany())

    if (error) {
      this.logger.error(`${PlansService.name}[findAll]`, error)
      throw new InternalServerErrorException('Something went wrong when trying to get plans.')
    }

    return plans.map((plan) => PlanEntity.convertToPayload(plan))
  }

  async findPlanById(teamId: string, planId: string): Promise<PlanEntity> {
    const query = this.plansRepository
      .createQueryBuilder('plans')
      .leftJoinAndSelect('plans.sectors', 'sectors')
      .where('plans.id = :id', { id: planId })

    if (teamId) query.andWhere('plans.teamId = :teamId', { teamId })

    const [error, plan] = await eres(query.getOne())

    if (error) {
      this.logger.error(`${PlansService.name}[findAll]`, error)
      throw new InternalServerErrorException('Something went wrong when trying to get plans.')
    }

    return plan
  }

  async findOne(teamId: string, planId: string): Promise<PlanPayload> {
    const plan = await this.findPlanById(teamId, planId)

    return PlanEntity.convertToPayload(plan)
  }

  async update(teamId: string, planId: string, data: UpdatePlanDto): Promise<PlanPayload> {
    const plan = await this.findPlanById(teamId, planId)

    if (!!data?.sectors.length) {
      const sectors = await this.findSectors(data.sectors)
      data.sectors = sectors
    }

    const updatedPlan = this.plansRepository.merge(plan, data)

    const [error, result] = await eres(this.plansRepository.save(updatedPlan))

    if (error) {
      this.logger.error(`${PlansService.name}[update - id: ${planId}]`, error)

      throw new InternalServerErrorException('Something went wrong when trying to update plan.')
    }

    return PlanEntity.convertToPayload(result)
  }

  async remove(teamId: string, planId: string): Promise<boolean> {
    const plan = await this.findPlanById(teamId, planId)

    const [error] = await eres(this.plansRepository.remove(plan))

    if (error) throw new InternalServerErrorException('Something went wrong when trying to remove plan.')

    return true
  }
}
