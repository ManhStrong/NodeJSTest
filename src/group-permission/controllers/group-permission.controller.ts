import { Controller, Body, Post, Get } from '@nestjs/common';
import { GroupPermissionService } from '../services/group-permission.service';
import { CreatePermissionGroupInput } from '../dtos/create-permission-group-input.dto';

@Controller('group-permission')
export class GroupPermissionController {
  constructor(
    private readonly groupPermissionService: GroupPermissionService,
  ) {}
  @Post()
  async createPermissionGroup(
    @Body() createPermissionGroupInput: CreatePermissionGroupInput,
  ): Promise<void> {
    return await this.groupPermissionService.createPermissionGroup(
      createPermissionGroupInput,
    );
  }

  @Get()
  async getAllGroupPermission(): Promise<any> {
    return await this.groupPermissionService.getAllGroupPermission();
  }
}
