import {
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
    message: 'Password up to 20 charaters',
  })
  @IsString()
  password: string;
}
