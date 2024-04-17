import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { Group } from './group.entity';

@Entity('group-permissions')
export class GroupPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    name: 'group_id',
  })
  groupId: number;

  @Column({
    type: 'int',
    name: 'permission_id',
  })
  permissionId: number;

  @Column({
    type: 'boolean',
    name: 'is_active',
    nullable: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt?: Date;

  @ManyToOne(() => Group, (group) => group.groupPermissions)
  @JoinColumn({
    name: 'group_id',
    referencedColumnName: 'id',
  })
  group: Group;

  @ManyToOne(() => Permission, (permission) => permission.groupPermissions)
  @JoinColumn({
    name: 'permission_id',
  })
  permission: Permission;
}
