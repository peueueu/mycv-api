import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(email: string, username: string, password: string) {
    // See if email is in use

    const users = await this.usersService.find(email);

    if (users.length) {
      throw new HttpException('Email is already in use', HttpStatus.CONFLICT, {
        cause: new Error('Email is already in use'),
      });
    }

    const salt = randomBytes(8).toString('hex');
    const result = await this.hashPassword(password, salt);

    const user = this.usersService.create({
      email,
      username,
      password: result,
    });

    return user;
  }

  async signin(email: string, username: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new HttpException(
        'There is no account with the provided email.',
        HttpStatus.NOT_FOUND,
        {
          cause: new Error('There is no account with the provided email.'),
        },
      );
    }

    const [salt, storedHash] = user.password.split('.');
    const [, hash] = (await this.hashPassword(password, salt)).split('.');

    if (storedHash !== hash) {
      throw new HttpException('Bad password', HttpStatus.BAD_REQUEST, {
        cause: new Error('Bad password'),
      });
    }

    return user;
  }

  private async hashPassword(password: string, salt: string) {
    /*TODO:
     * Hash the users password ✅
     * Generate a salt ✅
     * Hash the salt and the password together ✅
     * Join the hashed result and the salt together ✅
     */

    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = `${salt}.${hash.toString('hex')}`;

    return result;
  }
}
