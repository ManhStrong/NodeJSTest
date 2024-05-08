import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GroupCreateInput{
  @IsString()
  @IsNotEmpty()
  groupName: string;

  @IsArray()
  @IsOptional()
  permissions: number[];
}