import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, ValidateNested } from "class-validator";

export class CreatePermissionGroupInput{
  @IsInt()
  groupId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Permissions)
  permissions: Permissions[];
}

export class Permissions {
  @IsInt()
  permissionId: number;

  @IsBoolean()
  isActive: boolean
}