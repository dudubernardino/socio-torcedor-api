import { UserJwtPayload } from '@lib/entities'
import { PlanPayload } from '@lib/entities/plan.entity'
import { EnumRoles } from '@lib/enums'
import { Roles } from '@lib/jwt'
import { JwtAuthGuard, RolesGuard } from '@lib/jwt/guards'
import { HttpExceptionFilter } from '@lib/utils'
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseFilters, UseGuards } from '@nestjs/common'
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
  @Roles(EnumRoles.ADMIN, EnumRoles.MANAGER)
  async create(@Req() { user }: { user: UserJwtPayload }, @Body() planInput: PlanInputDto): Promise<PlanPayload> {
    const result = await this.plansService.create(user.teamId, planInput)

    return result
  }

  @Get()
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async findAll(@Req() { user }: { user: UserJwtPayload }): Promise<PlanPayload[]> {
    const result = await this.plansService.findAll(user.teamId)

    return result
  }

  @Get(':id')
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async findOne(@Req() { user }: { user: UserJwtPayload }, @Param('id') id: string): Promise<PlanPayload> {
    const result = await this.plansService.findOne(user.teamId, id)

    return result
  }

  @Patch(':id')
  @Roles(EnumRoles.ADMIN, EnumRoles.MANAGER)
  async update(
    @Req() { user }: { user: UserJwtPayload },
    @Param('id') id: string,
    @Body() data: UpdatePlanDto,
  ): Promise<PlanPayload> {
    const result = await this.plansService.update(user.teamId, id, data)

    return result
  }

  @Delete(':id')
  @Roles(EnumRoles.ADMIN, EnumRoles.MANAGER)
  async delete(@Req() { user }: { user: UserJwtPayload }, @Param('id') id: string): Promise<boolean> {
    const result = await this.plansService.remove(user.teamId, id)

    return result
  }
}
