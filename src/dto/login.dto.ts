import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @MinLength(4)
  @MaxLength(20)
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password!: string;
}
