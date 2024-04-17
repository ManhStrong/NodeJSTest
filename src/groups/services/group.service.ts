import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupRepository } from '../repositories/group.repository';
import { GroupCreateInput } from '../dtos/group-create.dto';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}
  async createGroup(groupCreateInput: GroupCreateInput): Promise<void> {
    const groupExist = await this.groupRepository.findOne({
      where: { groupName: groupCreateInput.groupName },
    });
    if (groupExist) throw new BadRequestException('Group is exist');
    await this.groupRepository.save(groupCreateInput);
  }
}
