import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user.dto';

export class RegisterLinkedInUserDto extends PartialType(RegisterUserDto) {
  givenName: string;
  familyName: string;
  email: string;
  id: string;
}
