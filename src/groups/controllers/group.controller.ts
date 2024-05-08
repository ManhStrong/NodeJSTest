import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from '../services/group.service';
import { GroupCreateInput } from '../dtos/group-create.dto';
import { GroupUpdateInput } from '../dtos/group-update.dto';
import { GroupResponse } from '../dtos/group-response.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/auth.guard';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(JwtAuthUserGuard)
  @Post()
  async create(@Body() groupCreateInput: GroupCreateInput): Promise<void> {
    return await this.groupService.create(groupCreateInput);
  }

  @UseGuards(JwtAuthUserGuard)
  @Patch()
  async update(
    @Param('id') id: number,
    @Body() groupUpdateInput: GroupUpdateInput,
  ): Promise<GroupResponse> {
    return await this.groupService.update(id, groupUpdateInput);
  }

  @UseGuards(JwtAuthUserGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.groupService.delete(id);
  }

  @Get()
  @UseGuards(JwtAuthUserGuard)
  async findAll(): Promise<GroupResponse[]> {
    return await this.groupService.findAll();
  }
}
