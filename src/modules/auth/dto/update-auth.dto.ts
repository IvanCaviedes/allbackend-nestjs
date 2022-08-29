import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './create-auth.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  state?: boolean;
}
