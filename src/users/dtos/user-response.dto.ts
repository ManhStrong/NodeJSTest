import { Expose } from 'class-transformer';
export class UserResponse {
  @Expose()
  userName: string;
  
  @Expose()
  permissions: Permission[];

  @Expose()
  groups: Group[];
}
export class Permission {
  permissionName: string;
}
export class Group {
  groupName: string;
}
