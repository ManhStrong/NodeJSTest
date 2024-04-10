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
      entities: [User, UserGroup, Group],
    }),
    UserModule,
    AuthModule,
    UserGroupModule,
    GroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
