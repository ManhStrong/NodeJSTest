import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repositories/user.repository';
import { CreateUserRequest } from '../dtos/create-user-request.dto';
import { UpdateUserRequest } from '../dtos/update-user-request.dto';
import { UserResponse } from '../dtos/user-response.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { DetailErrorCode } from 'src/shared/errors/detail-error-code';
import { ErrorCode } from 'src/shared/errors/error-code';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   *create user
   * @param createUserRequest CreateUserRequest
   * @returns void
   */
  async createUser(createUserRequest: CreateUserRequest): Promise<void> {
    const existingUser = await this.findUser(createUserRequest.userName);
    if (existingUser)
      throw new BadRequestException(
        new DetailErrorCode(ErrorCode.INVALID_PARAM, 'Username already exists'),
      );
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
      throw new NotFoundException(new DetailErrorCode(ErrorCode.NOT_FOUND));
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
}
