import { GroupPermission } from './group-permission.entity';
import { UserGroup } from './user-group.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({
  name: 'groups',
})
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'group_name',
  })
  groupName: string;

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

  @OneToMany(() => UserGroup, (userGroups) => userGroups.group)
  userGroups: UserGroup[];

  @OneToMany(
    () => GroupPermission,
    (groupPermissions) => groupPermissions.group
  )
  groupPermissions: GroupPermission[];
}
