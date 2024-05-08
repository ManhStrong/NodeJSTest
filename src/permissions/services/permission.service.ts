import { BadRequestException, Injectable } from '@nestjs/common';
import { PermissionRepository } from '../repositories/permission.repository';
import { PermissionCreateInput } from '../dtos/permission-create-input.dto';
import { PermissionResponse } from '../dtos/permission-response.dto';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async createPermission(
    permissionCreateInput: PermissionCreateInput,
  ): Promise<PermissionResponse> {
    const permissionExist = await this.permissionRepository.findOne({
      where: { permissionName: permissionCreateInput.permissionName },
    });
    if (permissionExist) throw new BadRequestException('Group is exist');
    const entity = await this.permissionRepository.create(
      permissionCreateInput,
    );
    const newPermission = await this.permissionRepository.save(entity);
    return plainToInstance(PermissionResponse, newPermission, {
      excludeExtraneousValues: true,
    });
  }
}
