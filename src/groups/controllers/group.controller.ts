import { Body, Controller, Get, Post } from '@nestjs/common';
import { GroupService } from '../services/group.service';
import { GroupCreateInput } from '../dtos/group-create.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async createGroup(@Body() groupCreateInput: GroupCreateInput): Promise<void> {
    return await this.groupService.createGroup(groupCreateInput);
  }
}
