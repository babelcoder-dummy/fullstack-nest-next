import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginStrategy } from './strategies/login.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { RegisterStrategy } from './strategies/register.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoginStrategy,
    RegisterStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
