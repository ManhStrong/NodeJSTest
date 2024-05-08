import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermissionRepository } from './repositories/user-permission.repository';
import { UserPermissionController } from './controllers/user-permission.controller';
import { UserPermissionService } from './services/user-permission.service';
import { UserRepository } from '../users/repositories/user.repository';
@Module({
  imports: [TypeOrmModule.forFeature([UserPermissionRepository, UserRepository])],
  controllers: [UserPermissionController],
  providers: [UserPermissionService],
  exports: [UserPermissionService],
})
export class UserPremissionModule {}
