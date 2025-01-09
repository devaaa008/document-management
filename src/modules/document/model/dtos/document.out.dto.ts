import { ApiProperty } from '@nestjs/swagger';

export class DocumentOutDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  s3Location: string;
  @ApiProperty()
  createdBy: number;
  @ApiProperty()
  createdOn: Date;
}
