import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    required: true,
    example: 'abcd1234',
  })
  @IsString()
  username: string;

  @IsString()
  password: string;
}
