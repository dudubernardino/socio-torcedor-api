import { JwtAuthGuard, RolesGuard } from '@lib/jwt/guards'
import { HttpExceptionFilter } from '@lib/utils'
import { Controller, UseFilters, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CheckinsService } from './checkin.service'

@Controller('checkin')
@ApiTags('/checkin')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(HttpExceptionFilter)
export class CheckinController {
  constructor(private readonly checkinsService: CheckinsService) {}
}
