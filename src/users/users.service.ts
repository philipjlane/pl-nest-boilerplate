import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: PaginateModel<UserDocument>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    // console.log(createUserDto);
    return await this.userModel.create(createUserDto);
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    const newUser = new this.userModel();
    newUser.email = registerUserDto.email;
    newUser.givenName = registerUserDto.givenName;
    newUser.familyName = registerUserDto.familyName;
    newUser.password = hashedPassword;

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

  update(id: string, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);

    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
