import { Controller } from '@nestjs/common';
import { GroupService } from '../services/group.service';

@Controller()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
}
