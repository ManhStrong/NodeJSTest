import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../users/repositories/user.repository';
import { CreateUserRequest } from '../dtos/create-user-request.dto';
import { UpdateUserRequest } from '../dtos/update-user-request.dto';
import { UserResponse } from '../dtos/user-response.dto';
import { In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { PermissionRepository } from '../../permissions/repositories/permission.repository';
import { UserPermissionRepository } from '../../user-permissions/repositories/user-permission.repository';
import { GroupRepository } from '../../groups/repositories/group.repository';
import { UserGroupRepository } from '../../user-group/repositories/user-group.repository';
import { UserPermission } from '../../entities/user-permission.entity';
import { UserGroup } from '../../entities/user-group.entity';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly userPermissionRepository: UserPermissionRepository,
    private readonly userGroupRepository: UserGroupRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  /**
   *create user
   * @param createUserRequest CreateUserRequest
   * @returns void
   */
  async create(createUserRequest: CreateUserRequest): Promise<void> {
    const existingUser = await this.findUser(createUserRequest.userName);
    if (existingUser) throw new BadRequestException('Username already exists');
    if (
      createUserRequest?.permissions &&
      createUserRequest?.permissions.length > 0
    ) {
      const permissionFound = await this.permissionRepository.find({
        where: { id: In(createUserRequest.permissions) },
      });
      if (permissionFound.length !== createUserRequest.permissions.length) {
        throw new NotFoundException('Permissions not found');
      }
    }

    if (createUserRequest?.groups && createUserRequest.groups.length > 0) {
      const groupFound = await this.groupRepository.find({
        where: { id: In(createUserRequest?.groups) },
      });
      if (groupFound.length !== createUserRequest?.groups.length) {
        throw new NotFoundException('Groups not found');
      }
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUserRequest.password, salt);
    const newUser = await this.userRepository.save({
      ...createUserRequest,
      password: passwordHash,
    });

    if (
      createUserRequest?.permissions &&
      createUserRequest.permissions.length > 0
    ) {
      const userPermissions = createUserRequest.permissions.map(
        (permission) => {
          return {
            userId: newUser.id,
            permissionId: permission,
          };
        },
      );
      await this.userPermissionRepository.insert(userPermissions);
    }
    if (createUserRequest?.groups && createUserRequest.groups.length > 0) {
      const userGroups = createUserRequest.groups.map((group) => {
        return {
          userId: newUser.id,
          groupId: group,
        };
      });
      await this.userGroupRepository.insert(userGroups);
    }
  }

  /**
   * Update user by id
   * @param userId number
   * @param updateUserReq UpdateProjectRequest
   * @returns UserResponse
   */
  async update(
    userId: number,
    updateUserReq: UpdateUserRequest,
  ): Promise<UserResponse> {
    const userUpdate = await this.userRepository.findById(userId);
    if (!userUpdate) {
      throw new NotFoundException('Not found user');
    }

    const updatedUser = {
      ...userUpdate,
      ...updateUserReq,
    };
    delete updatedUser.groups;
    delete updatedUser.permissions;

    const result = await this.userRepository.save(updatedUser);
    if (updateUserReq.permissions && updateUserReq.permissions.length > 0) {
      await this.userPermissionRepository.delete(
        plainToInstance(UserPermission, {
          userId: userId,
        }),
      );

      const userGroups = updateUserReq.groups.map((groupId) => {
        return {
          userId: userId,
          groupId: groupId,
        };
      });
      await this.userGroupRepository.insert(userGroups);
    }
    if (updateUserReq.groups && updateUserReq.groups.length > 0) {
      await this.userGroupRepository.delete(
        plainToInstance(UserGroup, {
          userId: userId,
        }),
      );

      const userPermissions = updateUserReq.permissions.map((permissionId) => {
        return {
          userId: userId,
          permissionId: permissionId,
        };
      });
      await this.userPermissionRepository.insert(userPermissions);
    }

    return plainToInstance(UserResponse, result, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * delete user by id
   * @param id number
   * @returns void
   */
  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    const userPermissions = await this.userPermissionRepository.find({
      where: { userId: user.id },
    });
    if (userPermissions.length > 0) {
      throw new ConflictException(
        'User has related permissions, cannot delete.',
      );
    }

    const userGroups = await this.userGroupRepository.find({
      where: { userId: user.id },
    });
    if (userGroups.length > 0) {
      throw new ConflictException('User has related groups, cannot delete.');
    }

    await this.userRepository.remove(user);
  }

  /**
   * get user by id
   * @param id
   * @returns UserResponse
   */
  async findOne(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findOne(id, {
      relations: [
        'userPermissions',
        'userPermissions.permission',
        'userGroups',
        'userGroups.group',
      ],
    });

    if (!user) {
      throw new NotFoundException('Not found User');
    }

    const userResponse: UserResponse = {
      userName: user.userName,
      permissions: user.userPermissions.map((up) => ({
        permissionName: up.permission?.permissionName,
      })),
      groups: user.userGroups.map((ug) => ({
        groupName: ug.group?.groupName,
      })),
    };

    return userResponse;
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.find({
      relations: [
        'userPermissions',
        'userPermissions.permission',
        'userGroups',
        'userGroups.group',
      ],
    });

    const userResponses: UserResponse[] = users.map((user) => ({
      userName: user.userName,
      permissions: user.userPermissions.map((up) => ({
        permissionName: up.permission?.permissionName,
      })),
      groups: user.userGroups.map((ug) => ({
        groupName: ug.group?.groupName,
      })),
    }));

    return userResponses;
  }

  /**
   * find user by userName
   * @param userName userName
   * @returns user
   */
  async findUser(userName: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { userName: userName },
    });
    return user;
  }

  async findUserPermission(username: string): Promise<any> {
    const users = await this.userRepository.findOne({
      where: { userName: username },
      relations: ['userPermissions', 'userPermissions.permission'],
    });
    const permissions = users.userPermissions.map(
      (userPermission) => userPermission.permission?.permissionName,
    );
    return permissions;
  }

  async uploadAvatar(
    userId: number,
    file: Express.Multer.File,
    fileValidationError: string,
  ): Promise<void> {
    let avatar;
    if (file) {
      avatar = file?.destination + '/' + file?.filename;
      if (fileValidationError) {
        throw new BadRequestException(fileValidationError);
      }
    }
    const user = await this.userRepository.findById(userId);

    const updatedUser = {
      ...user,
      avatar: avatar,
    };

    await this.userRepository.save(updatedUser);
  }
}
