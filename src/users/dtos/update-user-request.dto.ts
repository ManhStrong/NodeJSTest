import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserRequest {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userName?: string;

  @IsString()
  @IsOptional()
  avatar?: string
}