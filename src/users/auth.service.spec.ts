/* eslint-disable prettier/prettier */
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (userData: CreateUserDto) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email: userData.email,
          username: userData.username,
          password: userData.password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('tst@tstbird.com', 'tst_bird', 'asdf');
    expect(user.password).not.toEqual('asdf');

    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Throws an error if user signs up with email that is in use', async () => {
    await service.signup('tst@tstbird.com', 'tst_bird', 'asdf');

    await expect(
      service.signup('tst@tstbird.com', 'tst_bird', 'asdf'),
    ).rejects.toThrow(
      new HttpException('Email is already in use', HttpStatus.CONFLICT, {
        cause: new Error('Email is already in use'),
      }),
    );
  });
  it('Throws an error if signin is called with unused email', async () => {
    await expect(
      service.signin('tst@tstbird.com', 'tst_bird', 'asdf'),
    ).rejects.toThrow(
      new HttpException(
        'There is no account with the provided email.',
        HttpStatus.NOT_FOUND,
        { cause: new Error('There is no account with the provided email.') },
      ),
    );
  });

  it('Throws an error if invalid password is provided', async () => {
    await service.signup('tst@tstbird.com', 'tst_bird', 'asdf');
    await expect(
      service.signin('tst@tstbird.com', 'tst_bird', '123456doe'),
    ).rejects.toThrow(
      new HttpException('Bad password', HttpStatus.BAD_REQUEST, {
        cause: new Error('Bad password'),
      }),
    );
  });
  it('returns a user if correct password is provided', async () => {
    await service.signup('tst@tstbird.com', 'tst_bird', 'asdf');
    const user = await service.signin('tst@tstbird.com', 'tst_bird', 'asdf');
    expect(user).toBeDefined();
  });
});
