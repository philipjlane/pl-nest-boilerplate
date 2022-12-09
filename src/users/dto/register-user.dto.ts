import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  givenName: string;

  @IsString()
  familyName: string;

  // TODO add strong password criteria
  @IsString()
  @MinLength(8)
  password: string;

  @IsEmail()
  email: string;
}
