import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserRequest } from '../dtos/create-user-request.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  const mockUser: any = {
    id: 1,
    userName: 'name1',
    avatar: 'image',
    password: 'Manh123123!',
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
            findOne: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            findUser: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserRequest: CreateUserRequest = {
        userName: 'testUser',
        password: '123456',
        permissions: [1, 2, 3],
        groups: [1, 2],
      };

      const createProjectSpy = jest
        .spyOn(userService, 'create')
        .mockResolvedValue(mockUser);

      await userController.create(createUserRequest);

      expect(createProjectSpy).toHaveBeenCalledWith(
        expect.objectContaining(createUserRequest),
      );
    });
    it('should throw BadRequestException if username already exists', async () => {
      const createUserRequest: CreateUserRequest = {
        userName: 'testUser',
        password: '123456',
        permissions: [1, 2, 3],
        groups: [1, 2],
      };
      jest
        .spyOn(userService, 'create')
        .mockRejectedValue(new BadRequestException('Username already exists')); // Mocking that user already exists

      await expect(userController.create(createUserRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if permissions are not found', async () => {
      const createUserRequest: CreateUserRequest = {
        userName: 'testUser',
        password: '123456',
        permissions: [100, 200, 300],
        groups: [1, 2],
      };

      jest
        .spyOn(userService, 'create')
        .mockRejectedValueOnce(new NotFoundException('Permissions not found'));

      await expect(userController.create(createUserRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if groups are not found', async () => {
      const createUserRequest: CreateUserRequest = {
        userName: 'testUser',
        password: '123456',
        permissions: [1, 2, 3],
        groups: [100, 200],
      };

      jest
        .spyOn(userService, 'create')
        .mockRejectedValueOnce(new NotFoundException('Groups not found'));

      await expect(userController.create(createUserRequest)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: 1,
        userName: 'name1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        permissions: [
          {
            permissionName: 'permission1',
          },
        ],
        groups: [
          {
            groupName: 'groupOne',
          },
        ],
      };

      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);

      const result = await userController.findOne(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(userService.findOne).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw an error if user id is not found', async () => {
      const userId = 999;
      jest
        .spyOn(userService, 'findOne')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(userController.findOne(userId)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
      expect(userService.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('deleteUser', () => {
    it('should delete an existing user', async () => {
      const userId = 1;
      const deleteProjectSpy = jest
        .spyOn(userService, 'delete')
        .mockResolvedValue(undefined); // Mocking the successful deletion

      await expect(userController.delete(userId)).resolves.not.toThrow();

      expect(deleteProjectSpy).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if user id is not found', async () => {
      const userId = 999;
      jest
        .spyOn(userService, 'delete')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(userController.delete(userId)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const user: any = {
        id: 1,
        userName: 'name1',
        password: 'Manh123123!',
        permissions: [1, 2, 3],
        groups: [1, 2],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const updateProjectSpy = jest
        .spyOn(userService, 'update')
        .mockResolvedValue(user);

      const result = await userController.update(user.id, user);

      expect(result).toEqual(user);
      expect(updateProjectSpy).toHaveBeenCalledWith(user.id, user);
    });
    it('should throw an error if user id is not found', async () => {
      const updatedUser: any = {
        id: 99,
        userName: 'name99',
        password: 'Manh123123!',
        permissions: [1, 2, 3],
        groups: [1, 2],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const updateUserSpy = jest
        .spyOn(userService, 'update')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(
        userController.update(updatedUser.id, updatedUser),
      ).rejects.toThrow(new NotFoundException('User not found'));

      expect(updateUserSpy).toHaveBeenCalledWith(updatedUser.id, updatedUser);
    });
  });
});
