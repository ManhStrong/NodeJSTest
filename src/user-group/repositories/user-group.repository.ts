import { EntityRepository, Repository } from "typeorm";
import { UserGroup } from "../entities/user-group.entity";

@EntityRepository(UserGroup)
export class UserGroupReposiory extends Repository<UserGroup> {
  
}