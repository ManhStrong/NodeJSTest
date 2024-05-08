import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupPermissionRepository } from '../repositories/group-permission.repository';
import { CreatePermissionGroupInput } from '../dtos/create-permission-group-input.dto';
import { GroupRepository } from '../../groups/repositories/group.repository';
import { PermissionRepository } from '../../permissions/repositories/permission.repository';
import { In } from 'typeorm';

@Injectable()
export class GroupPermissionService {
  constructor(
    private readonly groupPermissionRepository: GroupPermissionRepository,
    private readonly groupRepository: GroupRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  

  
  async getAllGroupPermission(): Promise<any> {
    const groups = await this.groupRepository.find({
      relations: ['groupPermissions', 'groupPermissions.permission'],
    });

    return groups.map((group) => ({
      groupName: group.groupName,
      permission: group.groupPermissions.map((groupPermission) => ({
        permissionName: groupPermission.permission.permissionName,
        isActive: groupPermission.isActive,
      })),
    }));
  }
}
