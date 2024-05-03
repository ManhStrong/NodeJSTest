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

  async createPermissionGroup(
    createPermissionGroupInput: CreatePermissionGroupInput,
  ): Promise<void> {
    const { groupId, permissions } = createPermissionGroupInput;
    let group = await this.groupRepository.findOne({ where: { id: groupId } });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    const listPermissionFound = await this.permissionRepository.find({
      where: {
        id: In(permissions.map((permission) => permission.permissionId)),
      },
    });
    if (permissions.length !== listPermissionFound.length) {
      throw new NotFoundException('Permissions not found');
    }

    const groupPermissions = permissions.map((permission) => {
      return {
        groupId: groupId,
        permissionId: permission.permissionId,
        isActive: permission.isActive,
      };
    });
    await this.groupPermissionRepository.insert(groupPermissions);
  }

  
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
