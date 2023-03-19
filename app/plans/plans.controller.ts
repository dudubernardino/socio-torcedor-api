import { PlanPayload } from '@lib/entities/plan.entity'
import { EnumRoles } from '@lib/enums'
import { Roles } from '@lib/jwt'
import { JwtAuthGuard, RolesGuard } from '@lib/jwt/guards'
import { HttpExceptionFilter } from '@lib/utils'
import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { PlanInputDto } from './dtos/create-plan.dto'
import { UpdatePlanDto } from './dtos/update-plan.dto'
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

  @Get(':id')
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async findOne(@Param('id') id: string): Promise<PlanPayload> {
    const result = await this.plansService.findOne(id)

    return result
  }

  @Patch(':id')
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async update(@Param('id') id: string, @Body() data: UpdatePlanDto): Promise<PlanPayload> {
    const result = await this.plansService.update(id, data)

    return result
  }

  @Delete(':id')
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async delete(@Param('id') id: string): Promise<boolean> {
    const result = await this.plansService.remove(id)

    return result
  }
}
