import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/enums/role.enum';
import { randomUUID } from 'crypto';
import { addDays, compareAsc } from 'date-fns';
import { EmailService } from '../email/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
    const hashedPassword = await this.getPasswordHash(registerUserDto.password);

    const newUser = new this.userModel();
    newUser.email = registerUserDto.email;
    newUser.givenName = registerUserDto.givenName;
    newUser.familyName = registerUserDto.familyName;
    newUser.password = hashedPassword;
    newUser.role = Role.Subscriber;
    newUser.termsAccepted = registerUserDto.termsAccepted;

    try {
      await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Email is already registered');
      } else {
        throw error;
      }
    }

    // TODO create session and return cookie
    // send welcome/verify email
    this.emailService.sendEmail({
      From: 'no-reply@elaitch.dev',
      Subject: 'Welcome to the app',
      To: registerUserDto.email,
      TextBody:
        'Welcome to the app. Follow the link to verify your email address.',
      HtmlBody: '<p>Welcome to the app. Lorem Ipsum</p>',
    });
    return newUser;
  }

  async sendResetPasswordToken(email: string) {
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
    // TODO Centralise email templates
    this.emailService.sendEmail({
      From: 'no-reply@elaitch.dev',
      To: email,
      Subject: 'Request to reset password',
      HtmlBody: `<p>You have requested a password reset.</p>
      <p>Please click the link below to complete the process. The link is only valid for 24 hours.</p>
      <p><a href="http://localhost:9000/reset-password/confirm?token=${resetToken}">Click Here</a></p>`,
      TextBody: `You have requested a password reset.\n
      Please click the link below to complete the process. The link is only valid for 24 hours.\n
      http://localhost:9000/reset-password/confirm?token=${resetToken}`,
      MessageStream: 'outbound',
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // find user and validate token
    const user = await this.checkToken(resetPasswordDto.token);

    // Update password
    // Invalidate/remove reset token
    const hashedPassword = await this.getPasswordHash(
      resetPasswordDto.password,
    );
    return await this.userModel.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        resetToken: null,
      },
      { new: true },
    );
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

  async checkToken(token) {
    const user = await this.userModel
      .findOne({
        'resetToken.token': token,
      })
      .select(['resetToken']);

    if (!user) throw new NotFoundException();

    if (compareAsc(new Date(user.resetToken.expires), new Date()) !== 1)
      throw new HttpException('Token has expired', 498);

    return user;
  }

  private async getPasswordHash(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
