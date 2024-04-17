import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { GroupRepository } from 'src/groups/repositories/group.repository';
import { UserGroupRepository } from 'src/user-group/repositories/user-group.repository';
@Module({
  imports: [TypeOrmModule.forFeature([UserRepository,GroupRepository,UserGroupRepository])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
