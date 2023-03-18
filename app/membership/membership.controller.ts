import { MembershipPayload, UserJwtPayload } from '@lib/entities'
import { EnumRoles } from '@lib/enums'
import { Roles } from '@lib/jwt'
import { JwtAuthGuard, RolesGuard } from '@lib/jwt/guards'
import { HttpExceptionFilter } from '@lib/utils'
import { Body, Controller, Get, Post, Req, UseFilters, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateMembershipDto } from './dtos/create-membership.dto'
import { MembershipService } from './membership.service'

@Controller('membership')
@ApiTags('/membership')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(HttpExceptionFilter)
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post()
  @Roles(EnumRoles.USER)
  async create(
    @Req() { user }: { user: UserJwtPayload },
    @Body() data: CreateMembershipDto,
  ): Promise<MembershipPayload> {
    data.teamId = user.teamId
    data.userId = user.id

    const result = await this.membershipService.create(data)

    return result
  }

  @Get()
  @Roles(EnumRoles.ADMIN, EnumRoles.USER, EnumRoles.MANAGER)
  async findAll(@Req() { user }: { user: UserJwtPayload }): Promise<any> {
    const result = await this.membershipService.activeMembershipCount(user?.teamId)

    return result
  }
}
