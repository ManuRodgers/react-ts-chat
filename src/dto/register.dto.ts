import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { Kind } from '../enum/index';

export class RegisterDto {
  @IsEmail()
  @MinLength(4)
  @MaxLength(20)
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password!: string;

  kind!: Kind;
}
