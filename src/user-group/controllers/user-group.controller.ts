import { Body, Controller, Post } from '@nestjs/common';
import { UserGroupService } from '../services/user-group.service';
import { UserGroupCreateInput } from '../dtos/user-group-create-input.dto';
@Controller('user-groups')
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {}

  @Post()
  async createUserGroup(@Body() userGroupCreateInput: UserGroupCreateInput ):Promise<void> {
    return await this.userGroupService.createUserGroup(userGroupCreateInput);
  }
}
