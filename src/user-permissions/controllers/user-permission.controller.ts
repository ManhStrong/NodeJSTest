import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserPermissionService } from '../services/user-permission.service';
import { CreateUserPermissionInput } from '../dtos/create-user-permission-input.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/auth.guard';

@Controller('user-permissions')
export class UserPremissionController {
  constructor(private readonly userPermissionService: UserPermissionService) {}

  @UseGuards(JwtAuthUserGuard)
  @Post()
  async createUserPermission(
    @Body() createUserPermissionInput: CreateUserPermissionInput,
  ): Promise<void> {
    return await this.userPermissionService.createUserPermission(
      createUserPermissionInput,
    );
  }

  @UseGuards(JwtAuthUserGuard)
  @Get()
  async getAllUserPermission(): Promise<any> {
    return await this.userPermissionService.getAllUserPermission();
  }
}
