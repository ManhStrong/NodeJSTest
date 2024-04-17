import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserPermissionService } from '../services/user-permission.service';
import { CreateUserPermissionInput } from '../dtos/create-user-permission-input.dto';

@Controller('user-permissions')
export class UserPremissionController {
  constructor(private readonly userPermissionService: UserPermissionService) {}

  @Post()
  async createUserPermission(
    @Body() createUserPermissionInput: CreateUserPermissionInput,
  ): Promise<void> {
    return await this.userPermissionService.createUserPermission(
      createUserPermissionInput,
    );
  }

  @Get()
  async getAllUserPermission(): Promise<any> {
    return await this.userPermissionService.getAllUserPermission();
  }
}
