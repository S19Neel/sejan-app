import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDTO, RegisterDTO } from 'shared';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthServices {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(
    data: RegisterDTO,
  ): Promise<{ message: string; user: User }> {
    const { email, firstName, lastName, password, phone } = data;

    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hash,
      phone,
    });

    return { message: 'User created', user };
  }

  async loginUser(data: LoginDTO): Promise<{ message: string; token: string }> {
    const { email, password } = data;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { message: 'Login successfull', token };
  }
}
