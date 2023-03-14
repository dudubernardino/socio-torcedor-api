import { UserEntity } from '@lib/entities'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { UserInputDto } from './dtos/create-user.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() data: UserInputDto): Promise<UserEntity> {
    const result = await this.usersService.create(data)

    return result
  }

  @Get()
  async findAll(): Promise<UserEntity[]> {
    const result = await this.usersService.findAll()

    return result
  }
}
