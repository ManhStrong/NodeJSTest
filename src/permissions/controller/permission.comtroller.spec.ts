import { Test, TestingModule } from '@nestjs/testing';
import { PermissionController } from './permission.controller';
import { PermissionService } from '../services/permission.service';

describe('PermissionController', () => {
  let permissionController: PermissionController;
  let permissionService: PermissionService;

  const mockPermission: any = {
    id: 1,
    permissionName: 'permission1',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        {
          provide: PermissionService,
          useValue: {
            createPermission: jest.fn(),
          },
        },
      ],
    }).compile();

    permissionController =
      module.get<PermissionController>(PermissionController);
    permissionService = module.get<PermissionService>(PermissionService);
  });

  describe('create', () => {
    it('should create a new permission', async () => {
      const createPermissionSpy = jest
        .spyOn(permissionService, 'createPermission')
        .mockResolvedValue(mockPermission);

      const result = await permissionController.createPermission(
        mockPermission,
      );

      expect(result).toEqual(mockPermission);
      expect(createPermissionSpy).toHaveBeenCalledWith(mockPermission);
    });
  });
});
