import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/repositories/user.repository';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PermissionRepository } from '../permissions/repositories/permission.repository';
import { UserPermissionRepository } from '../user-permissions/repositories/user-permission.repository';
import { GroupRepository } from '../groups/repositories/group.repository';
import { UserGroupRepository } from '../user-group/repositories/user-group.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      PermissionRepository,
      UserPermissionRepository,
      GroupRepository,
      UserGroupRepository,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
