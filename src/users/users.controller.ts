import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  NotFoundException,
  UseFilters,
  Patch,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User as UserModel } from '@prisma/client';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@ApiTags('Users')
@Controller('users')
@Serialize(UserDto)
@UseFilters(new HttpExceptionFilter())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    const user = await this.usersService.user({ id: Number(id) });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  @Get()
  async getUsers(): Promise<UserModel[]> {
    return this.usersService.users({});
  }

  @Post()
  async signupUser(@Body() userData: CreateUserDto): Promise<UserModel> {
    return this.usersService.createUser(userData);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
  ): Promise<UserModel> {
    const user = await this.usersService.updateUser({
      where: { id: Number(id) },
      data: userData,
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    const user = await this.usersService.deleteUser({ id: Number(id) });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }
}
