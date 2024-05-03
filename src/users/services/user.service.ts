import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../users/repositories/user.repository';
import { CreateUserRequest } from '../dtos/create-user-request.dto';
import { UpdateUserRequest } from '../dtos/update-user-request.dto';
import { UserResponse } from '../dtos/user-response.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  /**
   *create user
   * @param createUserRequest CreateUserRequest
   * @returns void
   */
  async createUser(createUserRequest: CreateUserRequest): Promise<void> {
    const existingUser = await this.findUser(createUserRequest.userName);
    if (existingUser) throw new BadRequestException('Username already exists');
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUserRequest.password, salt);
    await this.userRepository.save({
      ...createUserRequest,
      password: passwordHash,
    });
  }

  /**
   * Update user by id
   * @param id number
   * @param updateUserReq UpdateProjectRequest
   * @returns UserResponse
   */
  async updateUser(
    id: number,
    updateUserReq: UpdateUserRequest,
  ): Promise<UserResponse> {
    const existProject = await this.userRepository.findById(id);
    if (!existProject) {
      throw new NotFoundException('Not found user');
    }
    const updateReq = {
      ...existProject,
      ...updateUserReq,
    };

    const result = await this.userRepository.save(updateReq);

    return plainToInstance(UserResponse, result, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * delete user by id
   * @param id number
   * @returns void
   */
  async deleteUser(id: number): Promise<void> {
    await this.userRepository.findById(id);
    await this.userRepository.delete(id);
  }

  /**
   * get user by id
   * @param id
   * @returns UserResponse
   */
  async getUserById(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if(!user) {
      throw new NotFoundException("Not found User");
    }
    return plainToInstance(UserResponse, user, {
      excludeExtraneousValues: true,
    });
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
}
