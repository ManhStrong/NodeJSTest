import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserGroupService } from '../services/user-group.service';
import { UserGroupCreateInput } from '../dtos/user-group-create-input.dto';
import { JwtAuthUserGuard } from '../../auth/guards/auth.guard';
@Controller('user-groups')
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {}

  
}
