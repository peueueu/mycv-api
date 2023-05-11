import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @ApiProperty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  password: string;
}
