import { Expose } from 'class-transformer';

export class PermissionResponse {
  @Expose()
  id: number;

  @Expose()
  permissionName: string;
}
