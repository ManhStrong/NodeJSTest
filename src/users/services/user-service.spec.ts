import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserResponse } from '../dtos/user-response.dto';
import { UpdateUserRequest } from '../dtos/update-user-request.dto';
import { User } from '../../entities/user.entity';

describe('UserService', () => {
  let userService: UserService;

  const mockUserRepository = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
  });

  const user: any = {
    id: 1,
    userName: 'name1',
    avatar: 'image',
    password: '$2b$10$2R3TIGvE/gMuUoWy83dPbejHojRwd3jHSwN19QLSHf6/ba.kvuVny',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserRepository.findById.mockResolvedValue(user);
      const project = await userService.getUserById(1);
      expect(project).toEqual(
        plainToInstance(UserResponse, user, {
          excludeExtraneousValues: true,
        }),
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if user id is not found', async () => {
      mockUserRepository.findById.mockRejectedValue(new NotFoundException());
      await expect(userService.getUserById(111)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should update an existing user', async () => {
      const dataUserMock: any = {
        id: 1,
        userName: 'name2',
        avatar: 'image',
        password:
          '$2b$10$2R3TIGvE/gMuUoWy83dPbejHojRwd3jHSwN19QLSHf6/ba.kvuVny',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      mockUserRepository.findById.mockResolvedValue(user);

      const updateUserBody = {
        userName: 'name2',
      };

      const dataMockSave = {
        ...dataUserMock,
        ...updateUserBody,
      };

      mockUserRepository.save.mockResolvedValue(dataMockSave);

      const updateUserReq: UpdateUserRequest = Object.assign(
        new UpdateUserRequest(),
        updateUserBody,
      );

      const updatedUser = await userService.updateUser(1, updateUserReq);

      expect(updatedUser).toEqual(
        plainToInstance(UserResponse, dataMockSave, {
          excludeExtraneousValues: true,
        }),
      );
    });
    it('should throw an error if user id is not found', async () => {
      const userId = 999;
      const updatedUser = new User();
      mockUserRepository.findById.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(userService.updateUser(userId, updatedUser)).rejects.toThrow(
        new Error('User not found'),
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should delete an existing user', async () => {
      mockUserRepository.findById.mockResolvedValue(user);
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      await userService.deleteUser(user.id);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(user.id);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(user.id);
    });

    it('should throw an error if user id is not found', async () => {
      const userId = 999;
      mockUserRepository.findById.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(userService.deleteUser(userId)).rejects.toThrow(
        new Error('User not found'),
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });
  });
});
