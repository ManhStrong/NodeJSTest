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
import { User } from './user.entity';
import { Group } from './group.entity';

@Entity('user-groups')
export class UserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'int',
    name: 'group_id',
  })
  groupId: number;

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

  @ManyToOne(() => User, (user) => user.userGroups)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;

  @ManyToOne(() => Group, (group) => group.userGroups)
  @JoinColumn({
    name: 'group_id',
  })
  group: Group;
}
