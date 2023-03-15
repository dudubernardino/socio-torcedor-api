import { UserEntity } from '@lib/entities'
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { UserInputDto } from './dtos/create-user.dto'
import { UpdateUserInputDto } from './dtos/update-user.dto'
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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    const result = await this.usersService.findOne(id)

    return result
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUserInputDto): Promise<UserEntity> {
    const result = await this.usersService.update(id, data)

    return result
  }
}
