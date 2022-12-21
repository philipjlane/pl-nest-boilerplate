import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  givenName: string;

  @IsString()
  familyName: string;

  @IsString()
  @MinLength(8)
  @Matches(
    /^(?:(?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))(?!.*(.)\1{2,})[A-Za-z0-9!~<>,;:_=?*+#."&§%°()\|\[\]\-\$\^\@\/]{8,128}$/,
  )
  password: string;

  @IsEmail()
  email: string;

  @IsDate()
  @Type(() => Date)
  termsAccepted: Date;
}
