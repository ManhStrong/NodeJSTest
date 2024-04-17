import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupPermissionRepository } from './repositories/group-permission.repository';
import { GroupPermissionController } from './controllers/group-permission.controller';
import { GroupPermissionService } from './services/group-permission.service';
import { GroupRepository } from 'src/groups/repositories/group.repository';
import { PermissionRepository } from 'src/permissions/repositories/permission.repository';
import { UserPermissionRepository } from 'src/user-permissions/repositories/user-permission.repository';
import { UserGroupRepository } from 'src/user-group/repositories/user-group.repository';
@Module({
  imports: [TypeOrmModule.forFeature([GroupPermissionRepository,GroupRepository,PermissionRepository, UserPermissionRepository,UserGroupRepository])],
  controllers: [GroupPermissionController],
  providers: [GroupPermissionService],
  exports: [GroupPermissionService],
})
export class GroupPermissionModule {}
