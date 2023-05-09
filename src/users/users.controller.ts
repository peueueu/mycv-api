import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User as UserModel } from '@prisma/client';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    return this.usersService.user({ id: Number(id) });
  }

  @Get()
  async getUsers(): Promise<UserModel[]> {
    return this.usersService.users({});
  }

  @Post()
  async signupUser(@Body() userData: CreateUserDto): Promise<UserModel> {
    return this.usersService.createUser(userData);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: { name?: string; email: string; password: string },
  ): Promise<UserModel> {
    return this.usersService.updateUser({
      where: { id: Number(id) },
      data: userData,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.usersService.deleteUser({ id: Number(id) });
  }
}
