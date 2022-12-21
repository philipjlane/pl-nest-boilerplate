import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/entities/user.entity';
import { RegisterLinkedInUserDto } from '../users/dto/register-linkedin-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOneByEmail(email, true);

    const validPassword = await bcrypt.compare(password, user.password);

    if (user && validPassword) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async findOrCreateLinkedinUser(
    registerLinkedInUserDto: RegisterLinkedInUserDto,
  ): Promise<UserDocument> {
    const user = await this.usersService.findOneByEmail(
      registerLinkedInUserDto.email,
    );

    if (user) {
      return user;
    }

    const { givenName, familyName, email, id } = registerLinkedInUserDto;
    const oAuthObj = {
      provider: 'linkedin', //TODO Extract magic string to constant
      id,
    };

    const newUser = await this.usersService.create({
      givenName,
      familyName,
      email,
      oAuth: oAuthObj,
    });

    return newUser;
  }
}
