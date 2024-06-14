import { User } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import { UserAddressDto } from './user-address.dto';
import { Role } from '../role.model';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  image: string;

  @Expose()
  @Transform(({ value }) => {
    switch (value) {
      case Role.Admin:
        return 'Admin';
      case Role.Manager:
        return 'Manager';
      default:
        return 'Member';
    }
  })
  role: Role;

  @Expose()
  @Type(() => UserAddressDto)
  address: UserAddressDto;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
