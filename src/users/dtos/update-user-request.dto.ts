import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserRequest {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userName?: string;

  @IsArray()
  @IsOptional()
  permissions: number[];

  @IsOptional()
  @IsArray()
  groups: number[];
}