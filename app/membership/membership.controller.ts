import { UserJwtPayload } from '@lib/entities'
import { EnumRoles } from '@lib/enums'
import { Roles } from '@lib/jwt'
import { JwtAuthGuard, RolesGuard } from '@lib/jwt/guards'
import { HttpExceptionFilter } from '@lib/utils'
import { Controller, Get, Req, UseFilters, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { MembershipService } from './membership.service'

@Controller('membership')
@ApiTags('/membership')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(HttpExceptionFilter)
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get()
  @Roles(EnumRoles.ADMIN)
  async findAll(@Req() { user }: { user: UserJwtPayload }): Promise<any> {
    const result = await this.membershipService.activeMembershipCount(user?.teamId)

    return result
  }
}
