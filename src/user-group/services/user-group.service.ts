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

  async createUserGroup(
    userGroupCreateInput: UserGroupCreateInput,
  ): Promise<void> {
    const { groupId, users } = userGroupCreateInput;
    let group = await this.groupRepository.findOne({ where: { id: groupId } });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    const listUserFound = await this.userRepository.find({
      where: { id: In(users.map((user) => user.userId)) },
    });
    if (users.length !== listUserFound.length) {
      throw new NotFoundException('Users not found');
    }

    const userGroups = users.map((user) => {
      return {
        groupId: groupId,
        userId: user.userId,
      };
    });
    await this.userGroupRepository.insert(userGroups);
  }
}
