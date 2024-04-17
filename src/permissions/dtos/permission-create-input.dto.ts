import { IsNotEmpty, IsString } from "class-validator";

export class PermissionCreateInput{
  @IsString()
  @IsNotEmpty()
  permissionName: string;
}