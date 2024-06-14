import { PartialType } from '@nestjs/mapped-types';
import { IsObject, IsOptional, IsString } from 'class-validator';

import { CreateUserDto } from './create-user.dto';
import { Type } from 'class-transformer';
import { UserAddressDto } from './user-address.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  image: string;

  @IsObject()
  @IsOptional()
  @Type(() => UserAddressDto)
  address?: UserAddressDto;
}
