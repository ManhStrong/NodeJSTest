import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PermissionService } from './permission.service';
import { PermissionRepository } from '../repositories/permission.repository';

describe('PermissionService', () => {
  let permissionService: PermissionService;

  const mockPermissionRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: getRepositoryToken(PermissionRepository),
          useValue: mockPermissionRepository,
        },
      ],
    }).compile();
    permissionService = module.get<PermissionService>(PermissionService);
  });

  const permission = {
    id: 1,
    permissionName: 'permission1',
  };
  describe('createPermission', () => {
    it('should create a new permission', async () => {
      mockPermissionRepository.create.mockReturnValue(permission);
      mockPermissionRepository.save.mockReturnValue(permission);
      const result = await permissionService.createPermission(permission);
      expect(result).toEqual(permission);
      expect(mockPermissionRepository.save).toHaveBeenCalledWith(permission);
    });
  });
});
