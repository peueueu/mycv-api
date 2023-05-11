import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async user({ id }) {
    const user = await this.repository.user({ id });
    return user;
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    const users = await this.repository.users({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    return users;
  }

  async createUser(data: Prisma.UserCreateInput) {
    const user = await this.repository.createUser(data);
    return user;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { where, data } = params;
    const user = await this.repository.updateUser({
      data,
      where,
    });
    return user;
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput) {
    try {
      const user = await this.repository.deleteUser(where);
      return user;
    } catch (error) {
      return null;
    }
  }
}
