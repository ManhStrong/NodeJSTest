import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../users/repositories/user.repository';
import { plainToInstance } from 'class-transformer';
import { PermissionsResponse } from '../dtos/permission-response.dto';
import { Response } from 'express';
import { createObjectCsvWriter } from 'csv-writer';

@Injectable()
export class UserPermissionService {
  constructor(private readonly userRepository: UserRepository) {}

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

  async exportUserPermission(res: Response, userId: number): Promise<void> {
    const permissions = await this.getPermissionByUserId(userId);
    const csvWriter = createObjectCsvWriter({
      path: `permission${userId}.csv`,
      header: [
        { id: 'No', title: 'No' },
        { id: 'permissionName', title: 'permissionName' },
        { id: 'isActive', title: 'isActive' },
      ],
    });

    const records = permissions.map((permission, index) => ({
      No: index + 1,
      permissionName: permission.permissionName,
      isActive: permission.isActive,
    }));

    await csvWriter.writeRecords(records);
  }

  async getPermissionByUserId(userId: number): Promise<PermissionsResponse[]> {
    const permissions = await this.userRepository.findOne({
      relations: ['userPermissions', 'userPermissions.permission'],
      where: {
        id: userId,
      },
    });
    if (!permissions) {
      throw new NotFoundException(`Not found user by id: ${userId}`);
    }
    const result = permissions.userPermissions.map((userPermission) => {
      return {
        permissionName: userPermission.permission.permissionName,
        isActive: userPermission.isActive,
      };
    });
    return plainToInstance(PermissionsResponse, result, {
      excludeExtraneousValues: true,
    });
  }
}
