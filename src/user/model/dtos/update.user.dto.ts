import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/role.enum';
import { IsEnum } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsEnum(Role)
  role: Role;
}
