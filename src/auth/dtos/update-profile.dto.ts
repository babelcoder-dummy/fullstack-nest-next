import { PartialType } from '@nestjs/mapped-types';

import { RegisterDto } from './register.dto';
import { IsObject, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UserAddressDto } from 'src/users/dtos/user-address.dto';

export class UpdateProfileDto extends PartialType(RegisterDto) {
  @IsObject()
  @IsOptional()
  @Type(() => UserAddressDto)
  address?: UserAddressDto;
}
