import { PlanEntity } from '@lib/entities/plan.entity'
import { eres } from '@lib/utils'
import { Injectable, InternalServerErrorException, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PlanInputDto } from './dtos/create-plan.dto'

import { PlanPayload } from '@lib/entities/plan.entity'
import { UpdatePlanDto } from './dtos/update-plan.dto'

@Injectable()
export class PlansService {
  logger = new Logger(PlansService.name)

  constructor(
    @InjectRepository(PlanEntity)
    private readonly plansRepository: Repository<PlanEntity>,
  ) {}

  async create(data: PlanInputDto): Promise<PlanPayload> {
    const plan = this.plansRepository.create(data)

    const [error, result] = await eres(plan.save())

    if (error) {
      this.logger.error(`${PlansService.name}[create]`, error)
      throw new InternalServerErrorException('Something went wrong when trying to create a new plan.')
    }

    return PlanEntity.convertToPayload(result)
  }

  async findAll(): Promise<PlanPayload[]> {
    const plans = await this.plansRepository.find()

    return plans.map((plan) => PlanEntity.convertToPayload(plan))
  }

  async findPlanById(planId: string): Promise<PlanEntity> {
    const [error, plan] = await eres(this.plansRepository.findOne({ where: { id: planId } }))

    if (error) {
      this.logger.error(`${PlansService.name}[findPlanById]`, error)
      throw new UnprocessableEntityException('Plan not found.')
    }

    return plan
  }

  async findOne(planId: string): Promise<PlanPayload> {
    const plan = await this.findPlanById(planId)

    return PlanEntity.convertToPayload(plan)
  }

  async update(planId: string, data: UpdatePlanDto): Promise<PlanPayload> {
    const plan = await this.findPlanById(planId)

    const updatedPlan = this.plansRepository.merge(plan, data)

    const [error, result] = await eres(this.plansRepository.save(updatedPlan))

    if (error) {
      this.logger.error(`${PlansService.name}[update - id: ${planId}]`, error)

      throw new InternalServerErrorException('Something went wrong when trying to update plan.')
    }

    return PlanEntity.convertToPayload(result)
  }

  async remove(planId: string): Promise<boolean> {
    const plan = await this.findPlanById(planId)

    const [error] = await eres(this.plansRepository.remove(plan))

    if (error) throw new InternalServerErrorException('Something went wrong when trying to remove plan.')

    return true
  }
}
