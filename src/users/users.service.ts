import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/enums/role.enum';
import { randomUUID } from 'crypto';
import { addDays } from 'date-fns';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: PaginateModel<UserDocument>,
    private emailService: EmailService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    const newUser = new this.userModel();
    newUser.email = registerUserDto.email;
    newUser.givenName = registerUserDto.givenName;
    newUser.familyName = registerUserDto.familyName;
    newUser.password = hashedPassword;
    newUser.role = Role.Subscriber;
    newUser.termsAccepted = registerUserDto.termsAccepted;

    // TODO handle duplicate email addresses
    await newUser.save();

    // TODO create session and return cookie
    // TODO send welcome/verify email
    this.emailService.sendEmail({
      From: 'no-reply@elaitch.dev',
      Subject: 'Welcome to the app',
      To: registerUserDto.email,
      TextBody: 'Welcome to the app. Lorem Ipsum',
      HtmlBody: '<p>Welcome to the app. Lorem Ipsum</p>',
    });
    return newUser;
  }

  async resetPassword(email: string) {
    // find user
    const user = await this.findOneByEmail(email);
    // Create reset token
    const resetToken = randomUUID();
    user.resetToken = {
      token: resetToken,
      expires: addDays(new Date(), 1),
    };
    // Store token with expiry in DB
    await user.save();
    // Send reset email to user with link
    // TODO get from env
    this.emailService.sendEmail({
      From: 'info@elaitch.dev',
      To: 'info@elaitch.dev',
      Subject: 'Hello from Postmark',
      HtmlBody: '<strong>Hello</strong> dear Postmark user.',
      TextBody: 'Hello from Postmark!',
      MessageStream: 'outbound',
    });
  }

  async findAll() {
    return await this.userModel.paginate();
  }

  async findOne(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async findOneByEmail(
    email: string,
    withPassword?: boolean,
  ): Promise<UserDocument> {
    return withPassword
      ? this.userModel.findOne({ email }).select('+password')
      : this.userModel.findOne({ email });
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate({ _id }, updateUserDto, {
      new: true,
      runValidators: true,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
