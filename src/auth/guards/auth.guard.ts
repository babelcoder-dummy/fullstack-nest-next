import { UseGuards, applyDecorators } from '@nestjs/common';

import { AccessTokenAuthGuard } from './access-token-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from 'src/users/role.model';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(AccessTokenAuthGuard, RolesGuard),
  );
}
