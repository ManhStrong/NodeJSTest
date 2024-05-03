import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupController } from './user-group.controller';
import { UserGroupService } from '../services/user-group.service';

describe('UserGroupController', () => {
  let userGroupController: UserGroupController;
  let userGroupService: UserGroupService;

  const mockUserGroup: any = {
    groupId: 1,
    users: [
      {
        userId: 1,
      },
      {
        userId: 2,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGroupController],
      providers: [
        {
          provide: UserGroupService,
          useValue: {
            createUserGroup: jest.fn(),
          },
        },
      ],
    }).compile();

    userGroupController = module.get<UserGroupController>(UserGroupController);
    userGroupService = module.get<UserGroupService>(UserGroupService);
  });

  describe('createUserGroup', () => {
    it('should create a new user group', async () => {
      const createPermissionSpy = jest
        .spyOn(userGroupService, 'createUserGroup')
        .mockResolvedValue(mockUserGroup);

      const result = await userGroupController.createUserGroup(mockUserGroup);

      expect(result).toEqual(mockUserGroup);
      expect(createPermissionSpy).toHaveBeenCalledWith(mockUserGroup);
    });
  });
});
