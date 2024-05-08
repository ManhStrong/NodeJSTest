import { EntityRepository, Repository } from 'typeorm';
import { Group } from '../../entities/group.entity';
import { NotFoundException } from '@nestjs/common';
@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
  async findById(id: number): Promise<Group> {
    const group = await this.findOne({
      where: {
        id: id,
      },
    });

    if (!group) {
      throw new NotFoundException(`Not found group by id: ${id}`);
    }

    return group;
  }
}
