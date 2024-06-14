import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import { ProfileWithTokensDto } from './dtos/profile-with-tokens.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { LoginAuthGuard } from './guards/login-auth.guard';
import { UploadFileInterceptor } from 'src/core/interceptors/upload-file.interceptor';
import { UserResponseDto } from 'src/users/dtos/user-response.dto';
import { RegisterAuthGuard } from './guards/register-auth.guard';
import { RefreshTokenAuthGuard } from './guards/refresh-token-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { AccessTokenAuthGuard } from './guards/access-token-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseGuards(RegisterAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async register(@CurrentUser() user: User) {
    return new UserResponseDto(user);
  }

  @Post('login')
  @UseGuards(LoginAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async login(@CurrentUser() user: User) {
    const profile = await this.authService.generateProfileWithTokens(user);

    return new ProfileWithTokensDto(profile);
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async refreshToken(@CurrentUser() user: User) {
    const profile = await this.authService.generateProfileWithTokens(user);

    return new ProfileWithTokensDto(profile);
  }

  @Get('profile')
  @UseGuards(AccessTokenAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    const profile = await this.authService.getProfile(user.id);

    return new UserResponseDto(profile);
  }

  @Patch('profile')
  @UploadFileInterceptor('image', { destination: 'uploads/users' })
  @UseGuards(AccessTokenAuthGuard)
  async updateProfile(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() form: UpdateProfileDto,
  ) {
    const profile = await this.authService.updateProfile(
      user.id,
      form,
      file.filename,
    );

    return new UserResponseDto(profile);
  }

  @Delete('logout')
  @UseGuards(AccessTokenAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }
}
