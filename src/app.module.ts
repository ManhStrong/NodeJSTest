import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { UserGroupModule } from './user-group/user-group.module';
import { GroupModule } from './groups/group.module';
import { UserGroup } from './entities/user-group.entity';
import { Group } from './entities/group.entity';
import { PermissionModule } from './permissions/premission.module';
import { UserPremissionModule } from './user-permissions/user-permission.module';
import { UserPermission } from './entities/user-permission.entity';
import { Permission } from './entities/permission.entity';
import { GroupPermissionModule } from './group-permission/group-permission.module';
import { GroupPermission } from './entities/group-permission.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        UserGroup,
        Group,
        Permission,
        UserPermission,
        GroupPermission,
      ],
    }),
    UserModule,
    AuthModule,
    UserGroupModule,
    GroupModule,
    PermissionModule,
    UserPremissionModule,
    GroupPermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
