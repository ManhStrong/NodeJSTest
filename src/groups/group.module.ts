import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupRepository } from './repositories/group.repository';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';
import { PermissionRepository } from '../permissions/repositories/permission.repository';
import { GroupPermissionRepository } from '../group-permission/repositories/group-permission.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupRepository,
      PermissionRepository,
      GroupPermissionRepository,
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
