import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroupReposiory } from './repositories/user-group.repository';
import { UserGroupController } from './controllers/user-group.controller';
import { UserGroupService } from './services/user-group.service';
@Module({
  imports: [TypeOrmModule.forFeature([UserGroupReposiory])],
  controllers: [UserGroupController],
  providers: [UserGroupService],
  exports: [UserGroupService],
})
export class UserGroupModule {}
