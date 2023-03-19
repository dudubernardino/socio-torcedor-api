import { StadiumPayload } from '@lib/entities'
import { EnumRoles } from '@lib/enums'
import { Roles } from '@lib/jwt'
import { JwtAuthGuard, RolesGuard } from '@lib/jwt/guards'
import { HttpExceptionFilter } from '@lib/utils'
import { Body, Controller, Get, Param, Post, Query, UseFilters, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateStadiumsDto } from './dtos/create-stadium.dto'
import { FilterStadiumsDto } from './dtos/filter-stadiums.dto'
import { StadiumsService } from './stadiums.service'

@Controller('stadiums')
@ApiTags('/stadiums')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(HttpExceptionFilter)
export class StadiumsController {
  constructor(private readonly stadiumsService: StadiumsService) {}

  @Post()
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async create(@Body() data: CreateStadiumsDto): Promise<StadiumPayload> {
    const result = await this.stadiumsService.create(data)

    return result
  }

  @Get()
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async findAll(@Query() filter: FilterStadiumsDto): Promise<StadiumPayload[]> {
    const result = await this.stadiumsService.findAll(filter)

    return result
  }

  @Get(':id')
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async findOne(@Param('id') id: string): Promise<StadiumPayload> {
    const result = await this.stadiumsService.findOne(id)

    return result
  }
}
