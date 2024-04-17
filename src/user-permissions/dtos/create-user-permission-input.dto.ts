import { Type } from "class-transformer";
import { IsArray, IsInt, ValidateNested } from "class-validator";

export class CreateUserPermissionInput{
  @IsInt()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Permissions)
  permissions: Permissions[];
}

export class Permissions {
  @IsInt()
  permissionId: number;
}