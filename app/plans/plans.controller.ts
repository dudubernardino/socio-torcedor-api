import { PlanPayload } from '@lib/entities/plan.entity'
import { EnumRoles } from '@lib/enums'
import { Roles } from '@lib/jwt'
import { JwtAuthGuard, RolesGuard } from '@lib/jwt/guards'
import { HttpExceptionFilter } from '@lib/utils'
import { Body, Controller, Get, Post, UseFilters, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { PlanInputDto } from './dtos/create-plan.dto'
import { PlansService } from './plans.service'

@Controller('plans')
@ApiTags('/plans')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(HttpExceptionFilter)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async login(@Body() planInput: PlanInputDto): Promise<PlanPayload> {
    const result = await this.plansService.create(planInput)

    return result
  }

  @Get()
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async findAll(): Promise<PlanPayload[]> {
    const result = await this.plansService.findAll()

    return result
  }
}
