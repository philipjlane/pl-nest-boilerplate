import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: PaginateModel<UserDocument>,
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

    // TODO handle duplicate email addresses
    await newUser.save();

    return newUser;
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
