import { Expose } from "class-transformer";

export class GroupResponse {
  @Expose()
  groupName: string;
}