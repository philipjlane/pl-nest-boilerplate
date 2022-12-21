import { PartialType } from '@nestjs/mapped-types';
import { Equals } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Equals(undefined)
  password: string;
}
