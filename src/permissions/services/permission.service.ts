import { BadRequestException, Injectable } from '@nestjs/common';
import { PermissionRepository } from '../repositories/permission.repository';
import { PermissionCreateInput } from '../dtos/permission-create-input.dto';
@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async createPermission(
    permissionCreateInput: PermissionCreateInput,
  ): Promise<void> {
    const groupExist = await this.permissionRepository.findOne({
      where: { groupName: permissionCreateInput.permissionName },
    });
    if (groupExist) throw new BadRequestException('Group is exist');
    await this.permissionRepository.save(permissionCreateInput);
  }
}
