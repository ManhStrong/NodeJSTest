import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserRequest {
  @IsString()
  userName: string;

  @MinLength(8, {
    message: 'Password must be at least 8 characters',
  })
  @MaxLength(20, {
    message: 'Password up to 20 characters',
  })
  @IsString()
  password: string;

  @IsArray()
  @IsOptional()
  permissions: number[];

  @IsOptional()
  @IsArray()
  groups: number[];
}
