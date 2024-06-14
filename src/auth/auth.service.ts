import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';
import ms from 'ms';

import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UsersService } from 'src/users/users.service';
import { AccessTokenPayload } from './models/access-token-payload.model';
import { ProfileWithTokens } from './models/profile-with-token.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async generateProfileWithTokens(user: User): Promise<ProfileWithTokens> {
    const payload: AccessTokenPayload = { sub: user.id, role: user.role };
    const refreshToken = this.jwtService.sign(
      {},
      {
        privateKey: process.env.REFRESH_TOKEN_SECRET_KEY,
        expiresIn: process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN,
      },
    );
    const accessToken = this.jwtService.sign(payload, {
      privateKey: process.env.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRES_IN,
    });

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      profile: user,
      accessToken,
      refreshToken,
      expiresIn:
        +new Date() + ms(process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRES_IN),
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) return null;

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    return isPasswordMatch ? omit(user, 'password') : null;
  }

  getProfile(userId: number) {
    return this.usersService.findById(userId);
  }

  updateProfile(userId: number, form: UpdateProfileDto, filepath: string) {
    return this.usersService.updateUser(userId, { image: filepath, ...form });
  }

  logout(userId: number) {
    return this.usersService.updateRefreshToken(userId, null);
  }
}
