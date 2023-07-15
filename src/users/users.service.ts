import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(userData: CreateUserDto) {
    const user = await this.repo.create(userData);

    return await this.repo.save(user);
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });

    if (!id) {
      throw new HttpException(
        'There is no user with id of null',
        HttpStatus.BAD_REQUEST,
        {
          cause: new Error('There is no user with id of null'),
        },
      );
    }

    return user;
  }

  async find(email: string) {
    return await this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND, {
        cause: new Error('User not found!'),
      });
    }

    Object.assign(user, attrs);

    return await this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND, {
        cause: new Error('User not found!'),
      });
    }

    return await this.repo.remove(user);
  }
}
