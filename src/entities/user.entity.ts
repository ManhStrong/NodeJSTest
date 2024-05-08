import { UserPermission } from './user-permission.entity';
import { UserGroup } from './user-group.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'user_name',
  })
  userName: string;

  @Column({
    name: 'avatar',
    nullable: true,
    default: null,
  })
  avatar: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'password',
  })
  password: string;

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

  @OneToMany(() => UserGroup, (userGroups) => userGroups.user)
  userGroups: UserGroup[];

  @OneToMany(() => UserPermission, (userPermissions) => userPermissions.user)
  userPermissions: UserPermission[];
}
