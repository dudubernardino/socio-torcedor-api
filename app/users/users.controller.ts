import { UserJwtPayload, UserPayload } from '@lib/entities'
import { EnumRoles } from '@lib/enums'
import { Roles } from '@lib/jwt'
import { JwtAuthGuard, RolesGuard } from '@lib/jwt/guards'
import { HttpExceptionFilter } from '@lib/utils'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseFilters, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserInputDto } from './dtos/create-user.dto'
import { FilterUserDto } from './dtos/filter-user.dto'
import { UpdateUserInputDto } from './dtos/update-user.dto'
import { UsersService } from './users.service'

@Controller('users')
@ApiTags('/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('teste')
  async test() {
    return 'TESTE CLOUD BUILD UHUUUUUUUU'
  }

  @Post()
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN)
  async create(@Req() { user }: { user: UserJwtPayload }, @Body() data: UserInputDto): Promise<UserPayload> {
    const result = await this.usersService.create({ ...data, role: EnumRoles.USER, teamId: user.teamId })

    return result
  }

  @Post('/custom')
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN)
  async createUserWithCustomRoles(
    @Req() { user }: { user: UserJwtPayload },
    @Body() data: UserInputDto,
  ): Promise<UserPayload> {
    const result = await this.usersService.create({ ...data, teamId: user.id })

    return result
  }

  @Get()
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER)
  async findAll(@Req() { user }: { user: UserJwtPayload }, @Query() filter: FilterUserDto): Promise<UserPayload[]> {
    const result = await this.usersService.findAll(user?.teamId, filter)

    return result
  }

  @Get(':id')
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER, EnumRoles.USER)
  async findOne(@Req() { user }: { user: UserJwtPayload }, @Param('id') id: string): Promise<UserPayload> {
    const result = await this.usersService.findOne(user.teamId, id)

    return result
  }

  @Patch(':id')
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER, EnumRoles.USER)
  async update(
    @Req() { user }: { user: UserJwtPayload },
    @Param('id') id: string,
    @Body() data: UpdateUserInputDto,
  ): Promise<UserPayload> {
    const result = await this.usersService.update(user.teamId, id, data)

    return result
  }

  @Delete(':id')
  @Roles(EnumRoles.SUPER_ADMIN, EnumRoles.ADMIN, EnumRoles.MANAGER, EnumRoles.USER)
  async remove(@Req() { user }: { user: UserJwtPayload }, @Param('id') id: string): Promise<boolean> {
    const result = await this.usersService.remove(user.teamId, id)

    return result
  }
}
