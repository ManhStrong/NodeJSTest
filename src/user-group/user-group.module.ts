import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroupController } from './controllers/user-group.controller';
import { UserGroupService } from './services/user-group.service';
import { UserGroupRepository } from './repositories/user-group.repository';
import { GroupRepository } from '../groups/repositories/group.repository';
import { UserRepository } from '../users/repositories/user.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserGroupRepository,
      GroupRepository,
      UserRepository
    ]),
  ],
  controllers: [UserGroupController],
  providers: [UserGroupService],
  exports: [UserGroupService],
})
export class UserGroupModule {}
