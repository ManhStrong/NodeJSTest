import { Body, Controller, Post } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { PermissionCreateInput } from '../dtos/permission-create-input.dto';
import { PermissionResponse } from '../dtos/permission-response.dto';
@Controller('/permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async createPermission(
    @Body() permissionCreateInput: PermissionCreateInput,
  ): Promise<PermissionResponse> {
    return await this.permissionService.createPermission(permissionCreateInput);
  }
}
