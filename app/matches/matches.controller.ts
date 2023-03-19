import { MatchPayload, UserJwtPayload } from '@lib/entities'
import { EnumRoles } from '@lib/enums'
import { Roles } from '@lib/jwt'
import { JwtAuthGuard, RolesGuard } from '@lib/jwt/guards'
import { HttpExceptionFilter } from '@lib/utils'
import { Body, Controller, Get, Param, Patch, Post, Req, UseFilters, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { MatchInputDto } from './dtos/create-match.dto'
import { UpdateMatchDto } from './dtos/update-match.dto'
import { MatchesService } from './matches.service'

@Controller('matches')
@ApiTags('/matches')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(HttpExceptionFilter)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async create(@Req() { user }: { user: UserJwtPayload }, @Body() data: MatchInputDto): Promise<MatchPayload> {
    const result = await this.matchesService.create(user.teamId, data)

    return result
  }

  @Get()
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async findAll(@Req() { user }: { user: UserJwtPayload }): Promise<MatchPayload[]> {
    const result = await this.matchesService.findAll(user.teamId)

    return result
  }

  @Get(':id')
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async findOne(@Req() { user }: { user: UserJwtPayload }, @Param('id') id: string): Promise<MatchPayload> {
    const result = await this.matchesService.findOne(user.teamId, id)

    return result
  }

  @Patch(':id')
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async update(
    @Req() { user }: { user: UserJwtPayload },
    @Param('id') id: string,
    @Body() data: UpdateMatchDto,
  ): Promise<MatchPayload> {
    const result = await this.matchesService.update(user.teamId, id, data)

    return result
  }
}
