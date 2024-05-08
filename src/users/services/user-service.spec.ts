import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserResponse } from '../dtos/user-response.dto';
import { UserPermissionRepository } from '../../user-permissions/repositories/user-permission.repository';
import { UserGroupRepository } from '../../user-group/repositories/user-group.repository';
import { GroupRepository } from '../../groups/repositories/group.repository';
import { PermissionRepository } from '../../permissions/repositories/permission.repository';

describe('UserService', () => {
  let userService: UserService;

  const mockUserRepository = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserPermissionRepository = {
    insert: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  const mockUserGroupRepository = {
    insert: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  const mockGroupRepository = {
    find: jest.fn(),
  };
  const mockPermissionRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(UserPermissionRepository),
          useValue: mockUserPermissionRepository,
        },
        {
          provide: getRepositoryToken(UserGroupRepository),
          useValue: mockUserGroupRepository,
        },
        {
          provide: getRepositoryToken(GroupRepository),
          useValue: mockGroupRepository,
        },
        {
          provide: getRepositoryToken(PermissionRepository),
          useValue: mockPermissionRepository,
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
  });

  const user: any = {
    id: 1,
    userName: 'name1',
    password: 'Manh123123!',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = {
        id: 1,
        userName: 'name1',
        password: 'Manh123123!',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        userPermissions: [
          {
            id: 1,
            userId: 1,
            permission: {
              id: 1,
              permissionName: 'permission1',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
        ],
        userGroups: [
          {
            id: 1,
            userId: 1,
            group: {
              id: 1,
              groupName: 'group1',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
        ],
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      const result = await userService.findOne(1);

      expect(result).toEqual({
        userName: 'name1',
        permissions: [{ permissionName: 'permission1' }],
        groups: [{ groupName: 'group1' }],
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith(1, {
        relations: [
          'userPermissions',
          'userPermissions.permission',
          'userGroups',
          'userGroups.group',
        ],
      });
    });

    it('should throw an error if user id is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(userService.findOne(111)).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith(111, {
        relations: [
          'userPermissions',
          'userPermissions.permission',
          'userGroups',
          'userGroups.group',
        ],
      });
    });
  });

  describe('update', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update an existing user', async () => {
      const userId = 1;
      const updateUserReq = {
        userName: 'updatedUserName',
        password: 'updatedPassword',
        permissions: [1, 2],
        groups: [3, 4],
      };

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValue(user);

      jest
        .spyOn(mockUserRepository, 'save')
        .mockResolvedValue({ ...user, ...updateUserReq });

      jest
        .spyOn(mockUserPermissionRepository, 'delete')
        .mockResolvedValue(null);
      jest.spyOn(mockUserGroupRepository, 'delete').mockResolvedValue(null);
      jest
        .spyOn(mockUserPermissionRepository, 'insert')
        .mockResolvedValue(null);
      jest.spyOn(mockUserGroupRepository, 'insert').mockResolvedValue(null);

      await expect(
        userService.update(userId, updateUserReq),
      ).resolves.not.toThrow();
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.anything());
      expect(mockUserPermissionRepository.delete).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(mockUserGroupRepository.delete).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(mockUserPermissionRepository.insert).toHaveBeenCalledWith(
        expect.any(Array),
      );
      expect(mockUserGroupRepository.insert).toHaveBeenCalledWith(
        expect.any(Array),
      );
    });

    it('should throw NotFoundException if user id is not found', async () => {
      const userId = 999;
      const updateUserReq = {
        userName: 'updatedUserName',
        password: 'updatedPassword',
        permissions: [1, 2],
        groups: [3, 4],
      };

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValue(null);

      await expect(userService.update(userId, updateUserReq)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // describe('delete', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it('should delete an existing user', async () => {
  //     mockUserRepository.findById.mockResolvedValue(user);
  //     mockUserRepository.delete.mockResolvedValue({ affected: 1 });

  //     await userService.delete(user.id);
  //     expect(mockUserRepository.findById).toHaveBeenCalledWith(user.id);
  //     expect(mockUserRepository.delete).toHaveBeenCalledWith(user.id);
  //   });

  //   it('should throw an error if user id is not found', async () => {
  //     const userId = 999;
  //     mockUserRepository.findById.mockRejectedValue(
  //       new Error('User not found'),
  //     );

  //     await expect(userService.delete(userId)).rejects.toThrow(
  //       new Error('User not found'),
  //     );
  //     expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
  //     expect(mockUserRepository.delete).not.toHaveBeenCalled();
  //   });
  // });

  describe('delete', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should delete an existing user if no related permissions or groups', async () => {
      const userId = 1;
      const user = {
        id: userId,
        userName: 'name1',
        password: 'Manh123123!',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockUserRepository.findById.mockResolvedValue(user);
      mockUserPermissionRepository.find.mockResolvedValue([]);
      mockUserGroupRepository.find.mockResolvedValue([]);

      await expect(userService.delete(userId)).resolves.not.toThrow();

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserPermissionRepository.find).toHaveBeenCalledWith({
        where: { userId: user.id },
      });
      expect(mockUserGroupRepository.find).toHaveBeenCalledWith({
        where: { userId: user.id },
      });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw a ConflictException if user has related permissions', async () => {
      const userId = 1;
      const user = {
        id: userId,
        userName: 'name1',
        password: 'Manh123123!',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const userPermissions = [{ id: 1, userId: userId }];
      mockUserRepository.findById.mockResolvedValue(user);
      mockUserPermissionRepository.find.mockResolvedValue(userPermissions);

      await expect(userService.delete(userId)).rejects.toThrow(
        ConflictException,
      );

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserPermissionRepository.find).toHaveBeenCalledWith({
        where: { userId: user.id },
      });
      expect(mockUserGroupRepository.find).not.toHaveBeenCalled();
      expect(mockUserRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw a ConflictException if user has related groups', async () => {
      const userId = 1;
      const user = {
        id: userId,
        userName: 'name1',
        password: 'Manh123123!',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const userGroups = [{ id: 1, userId: userId }];
      mockUserRepository.findById.mockResolvedValue(user);
      mockUserPermissionRepository.find.mockResolvedValue([]);
      mockUserGroupRepository.find.mockResolvedValue(userGroups);

      await expect(userService.delete(userId)).rejects.toThrow(
        ConflictException,
      );

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserPermissionRepository.find).toHaveBeenCalledWith({
        where: { userId: user.id },
      });
      expect(mockUserGroupRepository.find).toHaveBeenCalledWith({
        where: { userId: user.id },
      });
      expect(mockUserRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create a new user', async () => {
      const createUserRequest = {
        userName: 'newUser',
        password: 'password123',
        permissions: [1, 2, 3],
        groups: [4, 5],
      };

      jest.spyOn(userService, 'findUser').mockResolvedValue(null);

      jest
        .spyOn(mockPermissionRepository, 'find')
        .mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]);
      jest
        .spyOn(mockGroupRepository, 'find')
        .mockResolvedValue([{ id: 4 }, { id: 5 }]);

      jest.spyOn(mockUserRepository, 'save').mockResolvedValue(user);

      jest
        .spyOn(mockUserPermissionRepository, 'insert')
        .mockResolvedValue(null);
      jest.spyOn(mockUserGroupRepository, 'insert').mockResolvedValue(null);

      await expect(
        userService.create(createUserRequest),
      ).resolves.not.toThrow();
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          userName: 'newUser',
          password: expect.any(String),
          permissions: expect.any(Array),
          groups: expect.any(Array),
        }),
      );
      expect(mockUserPermissionRepository.insert).toHaveBeenCalledWith(
        expect.any(Array),
      );
      expect(mockUserGroupRepository.insert).toHaveBeenCalledWith(
        expect.any(Array),
      );
    });

    it('should throw BadRequestException if username already exists', async () => {
      const createUserRequest = {
        userName: 'existingUser',
        password: 'password123',
        permissions: [1, 2, 3],
        groups: [4, 5],
      };

      jest.spyOn(userService, 'findUser').mockResolvedValue(user);

      await expect(userService.create(createUserRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if permissions or groups are not found', async () => {
      const createUserRequest = {
        userName: 'newUser',
        password: 'password123',
        permissions: [1, 2, 3],
        groups: [4, 5],
      };

      jest.spyOn(mockPermissionRepository, 'find').mockResolvedValue([]);
      jest.spyOn(mockGroupRepository, 'find').mockResolvedValue([]);

      await expect(userService.create(createUserRequest)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
