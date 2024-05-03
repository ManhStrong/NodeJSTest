import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupPermissionRepository } from './repositories/group-permission.repository';
import { GroupPermissionController } from './controllers/group-permission.controller';
import { GroupPermissionService } from './services/group-permission.service';
import { GroupRepository } from '../groups/repositories/group.repository';
import { PermissionRepository } from '../permissions/repositories/permission.repository';
import { UserPermissionRepository } from '../user-permissions/repositories/user-permission.repository';
import { UserGroupRepository } from '../user-group/repositories/user-group.repository';
@Module({
  imports: [TypeOrmModule.forFeature([GroupPermissionRepository,GroupRepository,PermissionRepository, UserPermissionRepository,UserGroupRepository])],
  controllers: [GroupPermissionController],
  providers: [GroupPermissionService],
  exports: [GroupPermissionService],
})
export class GroupPermissionModule {}
