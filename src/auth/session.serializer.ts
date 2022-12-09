import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportSerializer } from '@nestjs/passport';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {
    super();
  }
  serializeUser(
    user: any,
    done: (err: Error, user: UserDocument) => void,
  ): any {
    done(null, user._id);
  }
  async deserializeUser(
    payload: any,
    done: (err: Error, payload: any) => void,
  ): Promise<any> {
    // Get the user from the db and add into to the req.session.
    const user = await this.userModel.findById(payload);
    done(null, user);
  }
}
