import { NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * get user by id
   * @param id number
   * @returns User
   */
  async findById(id: number): Promise<User> {
    const user = await this.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException(`Not found user by id: ${id}`);
    }

    return user;
  }
}
