import { PickType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { RegisterUserDto } from './register-user.dto';

export class ResetPasswordDto extends PickType(RegisterUserDto, ['password']) {
  @IsString()
  token: string;
}
