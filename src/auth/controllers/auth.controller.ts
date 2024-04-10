import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginInput } from './../dtos/login-input.dto';
import { LoginOutput } from '../dtos/login-output.dto';
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginInput: LoginInput): Promise<LoginOutput> {
    return this.authService.login(loginInput);
  }

  @Post('refreshToken')
  async refreshToken(
    @Body() bodyRefresh: { refreshToken: string },
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshToken(bodyRefresh);
  }
}
