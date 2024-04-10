import { Injectable } from '@nestjs/common';
import { UserGroupReposiory } from '../repositories/user-group.repository';

@Injectable()
export class UserGroupService {
  constructor(private readonly userGroupRepository: UserGroupReposiory) {}
}
