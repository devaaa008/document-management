import { SetMetadata } from '@nestjs/common';
import { Role } from '../../user/model/entities/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
