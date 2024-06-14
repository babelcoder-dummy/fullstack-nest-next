import { rm } from 'fs/promises';

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PrismaService } from 'src/core/services/prisma.service';
import { join } from 'path';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByRefreshToken(refreshToken: string) {
    return this.prisma.user.findUnique({ where: { refreshToken } });
  }

  async createUser(userDto: CreateUserDto) {
    const { password, ...rest } = userDto;
    const passwordHash = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        password: passwordHash,
        ...rest,
      },
    });
  }

  async updateUser(userId: number, userDto: UpdateUserDto) {
    const existingUser = await this.findById(userId);
    const { password, address, ...rest } = userDto;
    if (existingUser.image) {
      await rm(join(__dirname, '../../uploads/users', existingUser.image), {
        force: true,
      });
    }

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...rest,
        password: password ? await bcrypt.hash(password, 10) : undefined,
        address: address
          ? {
              connectOrCreate: {
                where: { userId },
                create: address,
              },
            }
          : undefined,
      },
      include: { address: true },
    });
  }

  updateRefreshToken(id: number, newToken: string | null) {
    return this.prisma.user.update({
      where: { id },
      data: { refreshToken: newToken },
    });
  }
}
