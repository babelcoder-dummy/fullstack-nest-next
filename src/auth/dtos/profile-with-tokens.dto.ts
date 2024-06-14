import { User } from '@prisma/client';
import { Expose, Type } from 'class-transformer';

import { UserResponseDto } from 'src/users/dtos/user-response.dto';
import { ProfileWithTokens } from '../models/profile-with-token.model';

export class ProfileWithTokensDto {
  @Expose()
  @Type(() => UserResponseDto)
  profile: User;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  expiresIn: number;

  constructor(profileWithTokens: Partial<ProfileWithTokens>) {
    Object.assign(this, profileWithTokens);
  }
}
