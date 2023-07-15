import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      // mock user: 'tst@tstbird.com', 'tst_bird', 'asdf'
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'tst@tstbird.com',
          username: 'tst_bird',
          password: 'asdf',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: Math.floor(Math.random() * 99999),
            email,
            username: 'tst_bird',
            password: 'asdf',
          } as User,
        ]);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          email: 'tst@tstbird.com',
          username: 'tst_bird',
          password: 'asdf',
        } as User);
      },
      update: (id: number, attrs: Partial<User>) => {
        return Promise.resolve({
          id,
          ...attrs,
        } as User);
      },
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, username: 'string', password: string) => {
        return Promise.resolve({ id: 1, email, username, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('tst@tstbird.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('tst@tstbird.com');
  });
  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });
  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(async () => await controller.findUser('1')).rejects.toThrow(
      new HttpException('User not found!', HttpStatus.NOT_FOUND, {
        cause: new Error('User not found!'),
      }),
    );
  });
  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      {
        email: 'tst@tstbird.com',
        password: 'asdf',
        username: 'tst_bird',
      },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
