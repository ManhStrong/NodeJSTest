import { NotFoundException } from '@nestjs/common';
import { DetailErrorCode } from 'src/shared/errors/detail-error-code';
import { ErrorCode } from 'src/shared/errors/error-code';
import { User } from 'src/users/entities/user.entity';
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
      throw new NotFoundException(
        new DetailErrorCode(ErrorCode.NOT_FOUND, `Not found user by id: ${id}`),
      );
    }

    return user;
  }
}
