import { ApplicationPayload, TeamPayload } from '@lib/entities'
import { EnumRoles } from '@lib/enums'
import { Roles } from '@lib/jwt'
import { JwtAuthGuard, RolesGuard } from '@lib/jwt/guards'
import { HttpExceptionFilter } from '@lib/utils'
import { Body, Controller, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { TeamAppInputDto } from './dtos/create-team-app.dto'
import { TeamInputDto } from './dtos/create-team.dto'
import { UpdateTeamInputDto } from './dtos/update-team.dto'
import { TeamsService } from './teams.service'

@Controller('teams')
@ApiTags('/teams')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(HttpExceptionFilter)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @Roles(EnumRoles.SUPER_ADMIN)
  async create(@Body() data: TeamInputDto): Promise<TeamPayload> {
    const result = await this.teamsService.create(data)

    return result
  }

  @Get()
  @Roles(EnumRoles.SUPER_ADMIN)
  async findAll(): Promise<TeamPayload[]> {
    const result = await this.teamsService.findAll()

    return result
  }

  @Get(':id')
  @Roles(EnumRoles.SUPER_ADMIN)
  async findOne(@Param('id') id: string): Promise<TeamPayload> {
    const result = await this.teamsService.findOne(id)

    return result
  }

  @Patch(':id')
  @Roles(EnumRoles.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() data: UpdateTeamInputDto): Promise<TeamPayload> {
    const result = await this.teamsService.update(id, data)

    return result
  }

  @Patch(':id/enable')
  @Roles(EnumRoles.SUPER_ADMIN)
  async enable(@Param('id') id: string): Promise<TeamPayload> {
    const result = await this.teamsService.enable(id)

    return result
  }

  @Patch(':id/disable')
  @Roles(EnumRoles.SUPER_ADMIN)
  async disable(@Param('id') id: string): Promise<TeamPayload> {
    const result = await this.teamsService.disable(id)

    return result
  }

  @Post(':id/apps')
  @Roles(EnumRoles.SUPER_ADMIN)
  async createApplication(@Param('id') id: string, @Body() data: TeamAppInputDto): Promise<ApplicationPayload> {
    const result = await this.teamsService.createApplication(id, data)

    return result
  }

  @Get(':id/apps')
  @Roles(EnumRoles.SUPER_ADMIN)
  async findAllApplications(@Param('id') id: string): Promise<any> {
    const result = await this.teamsService.findApplications(id)

    return result
  }
}
