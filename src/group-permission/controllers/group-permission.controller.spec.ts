import { Test, TestingModule } from '@nestjs/testing';
import { GroupPermissionService } from '../services/group-permission.service';
import { GroupPermissionController } from './group-permission.controller';

describe('GroupPermissionController', () => {
  let groupPermissionController: GroupPermissionController;
  let groupPermissionService: GroupPermissionService;

  const mockGroupPermission: any = {
    groupId: 1,
    permissions: [
      {
        permissionId: 1,
      },
      {
        permissionId: 2,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupPermissionController],
      providers: [
        {
          provide: GroupPermissionService,
          useValue: {
            createPermissionGroup: jest.fn(),
            getAllGroupPermission: jest.fn(),
          }, 
        },
      ],
    }).compile();

    groupPermissionController = module.get<GroupPermissionController>(
      GroupPermissionController,
    );
    groupPermissionService = module.get<GroupPermissionService>(
      GroupPermissionService,
    );
  });

  describe('createGroupPermission', () => {
    it('should create a new group permission', async () => {
      const createGroupPermissionSpy = jest
        .spyOn(groupPermissionService, 'createPermissionGroup')
        .mockResolvedValue(mockGroupPermission);

      const result = await groupPermissionController.createPermissionGroup(
        mockGroupPermission,
      );

      expect(result).toEqual(mockGroupPermission);
      expect(createGroupPermissionSpy).toHaveBeenCalledWith(
        mockGroupPermission,
      );
    });
  });

  describe('getAllGroupPermission', () => {
    it('should get all group permission', async () => {
      const mockGroupPermissions = [
        {
          groupName: 'GroupOne',
          permission: [
            {
              permissionName: 'xoa',
              isActive: false,
            },
            {
              permissionName: 'sua',
              isActive: true,
            },
            {
              permissionName: 'them',
              isActive: true,
            },
          ],
        },
        {
          groupName: 'GroupTwo',
          permission: [
            {
              permissionName: 'xoa',
              isActive: true,
            },
            {
              permissionName: 'them',
              isActive: false,
            },
          ],
        },
      ];

      const getAllGroupPermissionSpy = jest
        .spyOn(groupPermissionService, 'getAllGroupPermission')
        .mockResolvedValue(mockGroupPermissions);

      const result = await groupPermissionController.getAllGroupPermission();

      expect(result).toEqual(mockGroupPermissions);
      expect(getAllGroupPermissionSpy).toHaveBeenCalled();
    });
  });
});
