import { Expose } from "class-transformer";

export class UserResponse {
  @Expose()
  userName: string;
}