import { UserPayload } from '@lib/entities'
import { Public } from '@lib/jwt'
import { JwtAuthGuard } from '@lib/jwt/guards'
import { HttpExceptionFilter } from '@lib/utils'
import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserInputDto } from './dtos/create-user.dto'
import { UpdateUserInputDto } from './dtos/update-user.dto'
import { UsersService } from './users.service'

@Controller('users')
@ApiTags('/users')
@UseGuards(JwtAuthGuard)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() data: UserInputDto): Promise<UserPayload> {
    const result = await this.usersService.create(data)

    return result
  }

  @Get()
  async findAll(): Promise<UserPayload[]> {
    const result = await this.usersService.findAll()

    return result
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserPayload> {
    const result = await this.usersService.findOne(id)

    return result
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUserInputDto): Promise<UserPayload> {
    const result = await this.usersService.update(id, data)

    return result
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    const result = await this.usersService.remove(id)

    return result
  }
}
