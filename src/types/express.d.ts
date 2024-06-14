import * as prisma from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user: Partial<prisma.User> & Pick<prisma.User, 'id' | 'role'>;
    }
  }
}

export {};
