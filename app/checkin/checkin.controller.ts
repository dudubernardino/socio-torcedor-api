import { UserJwtPayload } from '@lib/entities'
import { EnumRoles } from '@lib/enums'
import { Roles } from '@lib/jwt'
import { JwtAuthGuard, RolesGuard } from '@lib/jwt/guards'
import { HttpExceptionFilter } from '@lib/utils'
import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseFilters, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CheckinsService } from './checkin.service'

import { CreateCheckinDto } from './dtos/create-checkin.dto'
import { FilterCheckinsDto } from './dtos/filter-checkin.dto'

@Controller('checkin')
@ApiTags('/checkin')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(HttpExceptionFilter)
export class CheckinController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @Post()
  @Roles(EnumRoles.USER)
  async create(@Req() { user }: { user: UserJwtPayload }, @Body() data: CreateCheckinDto): Promise<any> {
    const result = await this.checkinsService.create(user, data)

    return result
  }

  @Post(':checkinId')
  @Roles(EnumRoles.USER)
  async sendEmail(@Req() { user }: { user: UserJwtPayload }, @Param('checkinId') checkinId: string): Promise<any> {
    const result = await this.checkinsService.sendEmail(user, checkinId)

    return result
  }

  @Get(':matchId/all')
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async findAll(@Param('matchId') matchId: string, @Query() filter: FilterCheckinsDto): Promise<any> {
    const result = await this.checkinsService.findAll(matchId, filter)

    return result
  }

  @Get(':matchId')
  @Roles(EnumRoles.USER)
  async findOne(@Req() { user }: { user: UserJwtPayload }, @Param('matchId') matchId: string): Promise<any> {
    const result = await this.checkinsService.findOne(user, matchId)

    return result
  }

  @Delete(':matchId')
  @Roles(EnumRoles.USER)
  async delete(@Req() { user }: { user: UserJwtPayload }, @Param('matchId') matchId: string): Promise<boolean> {
    const result = await this.checkinsService.cancel(user, matchId)

    return result
  }
}
