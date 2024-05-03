import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { NotFoundException } from '@nestjs/common';
import { CreateUserRequest } from '../dtos/create-user-request.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  const mockUser: any = {
    id: 1,
    userName: 'name1',
    avatar: 'image',
    password: '$2b$10$2R3TIGvE/gMuUoWy83dPbejHojRwd3jHSwN19QLSHf6/ba.kvuVny',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
            deleteUser: jest.fn(),
            updateUser: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const getUserByIdSpy = jest
        .spyOn(userService, 'getUserById')
        .mockResolvedValue(mockUser);

      const result = await userController.getUserById(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(getUserByIdSpy).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw an error if user id is not found', async () => {
      const userId = 999;
      const getUserByIdSpy = jest
        .spyOn(userService, 'getUserById')
        .mockRejectedValue(new Error('User not found'));

      await expect(userController.getUserById(userId)).rejects.toThrow(
        new Error('User not found'),
      );
      expect(getUserByIdSpy).toHaveBeenCalledWith(userId);
    });
  });

  describe('deleteUser', () => {
    it('should delete an existing user', async () => {
      const userId = 1;
      const deleteProjectSpy = jest.spyOn(userService, 'deleteUser');

      await userController.deleteUser(userId);

      expect(deleteProjectSpy).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if user id is not found', async () => {
      const userId = 999;
      const deleteProjectSpy = jest
        .spyOn(userService, 'deleteUser')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(userController.deleteUser(userId)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
      expect(deleteProjectSpy).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const user: any = {
        id: 1,
        userName: 'name1',
        avatar: 'image',
        password:
          '$2b$10$2R3TIGvE/gMuUoWy83dPbejHojRwd3jHSwN19QLSHf6/ba.kvuVny',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const updateProjectSpy = jest
        .spyOn(userService, 'updateUser')
        .mockResolvedValue(user);

      const result = await userController.updateUser(user.id, user);

      expect(result).toEqual(user);
      expect(updateProjectSpy).toHaveBeenCalledWith(user.id, user);
    });
    it('should throw an error if user id is not found', async () => {
      const updatedUser: any = {
        id: 99,
        userName: 'name99',
        avatar: 'image',
        password:
          '$2b$10$2R3TIGvE/gMuUoWy83dPbejHojRwd3jHSwN19QLSHf6/ba.kvuVny',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const updateUserSpy = jest
        .spyOn(userService, 'updateUser')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(
        userController.updateUser(updatedUser.id, updatedUser),
      ).rejects.toThrow(new NotFoundException('User not found'));

      expect(updateUserSpy).toHaveBeenCalledWith(updatedUser.id, updatedUser);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserRequest: CreateUserRequest = {
        userName: 'testUser',
        password: '123456',
        avatar: undefined,
      };

      const createProjectSpy = jest
        .spyOn(userService, 'createUser')
        .mockResolvedValue(mockUser);

      await userController.createUser(createUserRequest, {} as any, null);

      expect(createProjectSpy).toHaveBeenCalledWith(
        expect.objectContaining(createUserRequest),
      );
    });
  });
});
