import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserService } from '../src/users/services/user.service';
import { JwtAuthUserGuard } from '../src/auth/guards/auth.guard';
import { PermissionService } from '../src/permissions/services/permission.service';
import { UserGroupService } from '../src/user-group/services/user-group.service';
import { UserPermissionService } from '../src/user-permissions/services/user-permission.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const mockUserService = {
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getUserById: jest.fn(),
  };
  const mockPermissionService = {
    createPermission: jest.fn(),
  };
  const mockUserGroupService = {
    createUserGroup: jest.fn(),
  };
  const mockUserPermissionService = {
    createUserPermission: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        UserService,
        PermissionService,
        UserGroupService,
        UserPermissionService,
      ],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(PermissionService)
      .useValue(mockPermissionService)
      .overrideProvider(UserGroupService)
      .useValue(mockUserGroupService)
      .overrideProvider(UserPermissionService)
      .useValue(mockUserPermissionService)
      .overrideGuard(JwtAuthUserGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  const validUserInput = {
    userName: 'John Dang',
    password: 'Manh123123!',
  };
  const user = {
    id: 1,
    ...validUserInput,
  };
  const permission = {
    permissionName: 'Permission5',
  };
  const mockPermission = {
    id: 5,
    ...permission,
  };
  const userGroup = {
    groupId: 3,
    users: [
      {
        userId: 1,
      },
      {
        userId: 2,
      },
    ],
  };
  const mockUserGroup = {
    id: 6,
    ...userGroup,
  };

  const userPermission = {
    userId: 1,
    permissions: [
      {
        permissionId: 1,
      },
      {
        permissionId: 2,
      },
    ],
  };
  const mockUserPermission = {
    ...userPermission,
    id: 6,
  };
  
  describe('delete user (DELETE)', () => {
    it('should delete a user', async () => {
      const idDelete = 1;
      const userMockDelete = {
        ...user,
        id: idDelete,
      };

      mockUserService.deleteUser.mockResolvedValue(userMockDelete);
      await request(app.getHttpServer())
        .delete(`/users/${idDelete}`)
        .expect(200);
      expect(mockUserService.deleteUser).toHaveBeenCalledWith('1');
    });

    it('should return 404 when user is not found', async () => {
      mockUserService.deleteUser.mockRejectedValue(new NotFoundException());
      await request(app.getHttpServer()).delete('/users/1000').expect(404);
      expect(mockUserService.deleteUser).toHaveBeenCalledWith('1000');
    });
  });

  describe('getUserById (GET)', () => {
    it('Should return a user with status code 200', async () => {
      mockUserService.getUserById.mockResolvedValue(user);
      await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(user);
        });
      expect(mockUserService.getUserById).toHaveBeenCalledWith(`${user.id}`);
    });

    it('Should return a 404 error if user invalid', async () => {
      const nonExistUserId = '1000';
      mockUserService.getUserById.mockRejectedValue(new NotFoundException());
      await request(app.getHttpServer())
        .get(`/users/${nonExistUserId}`)
        .expect(404);

      expect(mockUserService.getUserById).toHaveBeenCalledWith(
        `${nonExistUserId}`,
      );
    });
  });

  describe('create permission', () => {
    it('should create a new permission', async () => {
      mockPermissionService.createPermission.mockResolvedValue(mockPermission);
      await request(app.getHttpServer())
        .post('/permissions')
        .send(permission)
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual(mockPermission);
        });
      expect(mockPermissionService.createPermission).toHaveBeenCalledWith(
        permission,
      );
    });
  });
  describe('create user group', () => {
    it('should create a new user group', async () => {
      mockUserGroupService.createUserGroup.mockResolvedValue(mockUserGroup);
      await request(app.getHttpServer())
        .post('/user-groups')
        .send(userGroup)
        .then((response) => {
          expect(response.body).toEqual(mockUserGroup);
        });
      expect(mockUserGroupService.createUserGroup).toHaveBeenCalledWith(
        userGroup,
      );
    });
  });

  describe('create user permission', () => {
    it('should create a new user permission', async () => {
      mockUserPermissionService.createUserPermission.mockResolvedValue(
        mockUserPermission,
      );
      await request(app.getHttpServer())
        .post('/user-permissions')
        .send(userPermission)
        .then((response) => {
          expect(response.body).toEqual(mockUserPermission);
        });
      expect(
        mockUserPermissionService.createUserPermission,
      ).toHaveBeenCalledWith(userPermission);
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
