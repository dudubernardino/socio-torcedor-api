import { HttpExceptionFilter } from '@lib/utils'
import { Body, Controller, Post, UseFilters } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AuthOutputDto } from './dtos/auth-output.dto'
import { AuthDto } from './dtos/auth.dto'

@Controller('auth')
@ApiTags('/auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() authInput: AuthDto): Promise<AuthOutputDto> {
    const result = await this.authService.login(authInput)

    return result
  }
}
