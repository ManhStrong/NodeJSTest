import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserPermissionService } from '../services/user-permission.service';
import { JwtAuthUserGuard } from '../../auth/guards/auth.guard';
import { Response } from 'express';

@Controller('user-permissions')
export class UserPermissionController {
  constructor(private readonly userPermissionService: UserPermissionService) {}

  @UseGuards(JwtAuthUserGuard)
  @Get()
  async getAllUserPermission(): Promise<any> {
    return await this.userPermissionService.getAllUserPermission();
  }

  /**
   * export excel file permission by userId
   * @param res Response
   * @param userId number
   * @returns StreamableFile
   */
  @Get(':id/export-permissions')
  async exportUserPermission(
    @Res({ passthrough: true }) res: Response,
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<void> {
    return await this.userPermissionService.exportUserPermission(
      res,
      userId,
    );
  }
}
