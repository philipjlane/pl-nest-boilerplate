import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../auth/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  // @Transform(({ value }) => value.toString()) //for the class
  // _id: string;

  @Prop()
  givenName: string;

  @Prop()
  familyName: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ select: false }) //exclude from results by default. add back in with query.select('+password')
  password: string;

  @Prop()
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
