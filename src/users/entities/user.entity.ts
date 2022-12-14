import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../auth/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

export type OAuthProviderRecord = {
  provider: string;
  id: string;
};

export type ResetToken = {
  token: string;
  expires: Date;
};

@Schema({ timestamps: true, strict: true, strictQuery: false })
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
  termsAccepted: Date;

  @Prop()
  role: Role;

  @Prop([
    {
      provider: String,
      id: String,
    },
  ])
  oAuth: OAuthProviderRecord[];

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({
    type: {
      token: String,
      expires: Date,
    },
  })
  resetToken?: ResetToken;
}

export const UserSchema = SchemaFactory.createForClass(User);
