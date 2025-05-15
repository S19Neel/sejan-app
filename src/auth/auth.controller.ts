import { Body, Controller, Post } from '@nestjs/common';
import { AuthServices } from './auth.service';
import { LoginDTO, RegisterDTO } from 'shared';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthServices) {}

  @Post('register')
  async registerUser(@Body() data: RegisterDTO) {
    return this.authService.registerUser(data);
  }

  @Post('login')
  async loginUser(@Body() data: LoginDTO) {
    return this.authService.loginUser(data);
  }
}
