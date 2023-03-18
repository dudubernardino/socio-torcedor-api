import { PlanEntity } from '@lib/entities/plan.entity'
import { eres } from '@lib/utils'
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PlanInputDto } from './dtos/create-plan.dto'

import { PlanPayload } from '@lib/entities/plan.entity'

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
}
