import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { UsersService } from 'src/users/users.service';
import { RegisterDto } from '../dtos/register.dto';

@Injectable()
export class RegisterStrategy extends PassportStrategy(Strategy, 'register') {
  constructor(private usersService: UsersService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: Request<object, object, RegisterDto>) {
    return this.usersService.createUser(req.body);
  }
}
