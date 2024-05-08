import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GroupRepository } from '../repositories/group.repository';
import { GroupCreateInput } from '../dtos/group-create.dto';
import { GroupUpdateInput } from '../dtos/group-update.dto';
import { plainToInstance } from 'class-transformer';
import { GroupResponse } from '../dtos/group-response.dto';
import { PermissionRepository } from '../../permissions/repositories/permission.repository';
import { In } from 'typeorm';
import { GroupPermissionRepository } from '../../group-permission/repositories/group-permission.repository';
import { GroupPermission } from '../../entities/group-permission.entity';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly groupPermissionRepository: GroupPermissionRepository,
  ) {}
  async create(groupCreateInput: GroupCreateInput): Promise<void> {
    const groupExist = await this.groupRepository.findOne({
      where: { groupName: groupCreateInput.groupName },
    });
    if (groupExist) throw new BadRequestException('Group is exist');

    const permissionFound = await this.permissionRepository.find({
      where: { id: In(groupCreateInput.permissions) },
    });
    if (permissionFound.length !== groupCreateInput.permissions.length) {
      throw new NotFoundException('Permissions not found');
    }
    const newGroup = await this.groupRepository.save(groupCreateInput);

    const groupPermissions = groupCreateInput.permissions.map((permission) => {
      return {
        userId: newGroup.id,
        permissionId: permission,
      };
    });

    await this.groupPermissionRepository.insert(groupPermissions);
  }

  async update(
    groupId: number,
    groupUpdateInput: GroupUpdateInput,
  ): Promise<GroupResponse> {
    const existGroup = await this.groupRepository.findById(groupId);
    if (!existGroup) {
      throw new NotFoundException('Not found group');
    }
    const updatedGroup = {
      ...existGroup,
      ...groupUpdateInput,
    };
    delete updatedGroup.permissions;
    const result = await this.groupRepository.save(updatedGroup);

    if (
      groupUpdateInput.permissions &&
      groupUpdateInput.permissions.length > 0
    ) {
      await this.groupPermissionRepository.delete(
        plainToInstance(GroupPermission, {
          groupId: groupId,
        }),
      );
      const groupPermissions = groupUpdateInput.permissions.map(
        (permissionId) => {
          return {
            groupId: groupId,
            permissionId: permissionId,
          };
        },
      );
      await this.groupPermissionRepository.insert(groupPermissions);
    }
    return plainToInstance(GroupResponse, result, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: number): Promise<void> {
    await this.groupRepository.findById(id);
    await this.groupRepository.delete(id);
  }

  async findAll(): Promise<GroupResponse[]> {
    const groups = await this.groupRepository.find();
    return plainToInstance(GroupResponse, groups, {
      excludeExtraneousValues: true,
    });
  }
}
