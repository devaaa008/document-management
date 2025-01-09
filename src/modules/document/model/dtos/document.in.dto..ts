import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DocumentInDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  description?: string;
}
