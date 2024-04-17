import { EntityRepository, Repository } from 'typeorm';
import { GroupPermission } from '../../entities/group-permission.entity';

@EntityRepository(GroupPermission)
export class GroupPermissionRepository extends Repository<GroupPermission> {}
