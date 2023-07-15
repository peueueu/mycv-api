import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

describe('Authentication System', () => {
  let app: INestApplication;
  const mockUser: CreateUserDto = {
    email: 'testson2312@toppop.com',
    password: '1234562314789',
    username: 'testeson2_master',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(mockUser)
      .expect(201)
      .then((response) => {
        const { id, email } = response.body;
        expect(id).toBeDefined();
        expect(email).toEqual(mockUser.email);
      });
  });
});
