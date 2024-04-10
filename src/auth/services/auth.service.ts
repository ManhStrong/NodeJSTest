import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { UserService } from 'src/users/services/user.service';
import { LoginInput } from '../dtos/login-input.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenClaims, LoginOutput } from '../dtos/login-output.dto';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginReq: LoginInput): Promise<LoginOutput> {
    const user = await this.userService.findUser(loginReq.userName);
    const isMatch = await bcrypt.compare(loginReq.password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid username or password');
    const payload = {
      id: user.id,
      userName: user.userName,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_SECRET_KEY'),
      expiresIn: this.configService.get('REFRESH_EXPIRES_IN'),
    });
    return plainToInstance(LoginOutput, {
      accessToken,
      refreshToken,
    });
  }

  async refreshToken({ refreshToken }): Promise<{ accessToken: string }> {
    const decode = this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_SECRET_KEY,
    });
    const payload = {
      id: decode?.id,
      username: decode?.username,
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async getUserInfo(userName: string): Promise<AccessTokenClaims> {
    const user = await this.userService.findUser(userName);
    if (!user) {
      throw new UnauthorizedException('Not authorrizedException');
    }

    const accessTokenClaims: AccessTokenClaims = plainToInstance(
      AccessTokenClaims,
      user,
      {
        excludeExtraneousValues: true,
      },
    );

    return accessTokenClaims;
  }
}
