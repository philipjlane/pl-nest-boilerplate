import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    const validPassword = await bcrypt.compare(password, user.password);

    if (user && validPassword) {
      // const { password, ...result } = user;
      return user;
    }
    return null;
  }
}
