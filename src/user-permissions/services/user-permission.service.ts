import { Body, Injectable, NotFoundException, Post } from '@nestjs/common';
import { UserPermissionRepository } from '../repositories/user-permission.repository';
import { UserRepository } from '../../users/repositories/user.repository';
import { CreateUserPermissionInput } from '../dtos/create-user-permission-input.dto';
import { In } from 'typeorm';

@Injectable()
export class UserPermissionService {
  constructor(
    private readonly userPermissionRepository: UserPermissionRepository,
    private readonly userRepository: UserRepository
  ) {}
  
  async createUserPermission(createUserPermissionInput: CreateUserPermissionInput):Promise<void>{
    const { userId, permissions } = createUserPermissionInput;
    let group = await this.userRepository.findOne({ where: { id: userId } });

    if (!group) {
      throw new NotFoundException(`Group with ID ${userId} not found`);
    }

    const listPermissionFound = await this.userRepository.find({
      where: { id: In(permissions.map((permission) => permission.permissionId)) },
    });
    if (permissions.length !== listPermissionFound.length) {
      throw new NotFoundException('Users not found');
    }

    const userPermission = permissions.map((permission) => {
      return {
        userId: userId,
        permissionId: permission.permissionId,
      };
    });
    await this.userPermissionRepository.insert(userPermission);
  }


  async getAllUserPermission(): Promise<any> {
    const users = await this.userRepository.find({
      relations: [
        'userPermissions',
        'userPermissions.permission',
        'userGroups',
        'userGroups.group',
        'userGroups.group.groupPermissions',
        'userGroups.group.groupPermissions.permission',
      ],
    });

    const userPermissions = users.map((user) => {
      let permissions = [];

      // Lấy quyền từ UserPermission
      if (user.userPermissions.length > 0) {
        permissions = user.userPermissions.map((userPermission) => ({
          permissionName: userPermission.permission.permissionName,
          isActive: userPermission.isActive,
          isFromUser: true,
        }));
      }

      // Lấy quyền từ GroupPermission nếu user thuộc group có quyền và không có quyền tương ứng trong UserPermission
      user.userGroups.forEach((userGroup) => {
        const groupPermissions = userGroup.group.groupPermissions
          .filter(
            (groupPermission) =>
              !permissions.some(
                (p) =>
                  p.permissionName ===
                  groupPermission.permission.permissionName,
              ),
          )
          .map((groupPermission) => ({
            permissionName: groupPermission.permission.permissionName,
            isActive: groupPermission.isActive,
            isFromUser: false,
          }));
        permissions = [...permissions, ...groupPermissions];
      });
      return {
        userName: user.userName,
        permissions: permissions,
      };
    });
    return userPermissions;
  }
}
