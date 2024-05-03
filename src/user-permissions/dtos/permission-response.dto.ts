import { Expose } from "class-transformer";

export class PermissionsResponse {

  @Expose()
  permissionName: string;

  @Expose()
  isActive: boolean;
}