import { User } from '@prisma/client';

export interface ProfileWithTokens {
  profile: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
