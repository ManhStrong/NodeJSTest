import { Injectable, NotFoundException } from '@nestjs/common';
import { UserGroupCreateInput } from '../dtos/user-group-create-input.dto';
import { GroupRepository } from '../../groups/repositories/group.repository';
import { UserGroupRepository } from '../repositories/user-group.repository';
import { UserRepository } from '../../users/repositories/user.repository';
import { In } from 'typeorm';

@Injectable()
export class UserGroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userGroupRepository: UserGroupRepository,
    private readonly userRepository: UserRepository,
  ) {}

  
}
