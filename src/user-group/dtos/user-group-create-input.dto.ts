import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';

export class UserGroupCreateInput {
  @IsInt()
  groupId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Users)
  users: Users[];
}
export class Users {
  @IsInt()
  userId: number;
}
