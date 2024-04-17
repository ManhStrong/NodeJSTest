import { IsNotEmpty, IsString } from "class-validator";

export class GroupCreateInput{
  @IsString()
  @IsNotEmpty()
  groupName: string;
}