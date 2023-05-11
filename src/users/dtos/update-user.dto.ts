import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @ApiProperty()
  password: string;
}
