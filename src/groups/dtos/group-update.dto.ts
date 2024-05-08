import { IsArray, IsOptional, IsString } from "class-validator";

export class GroupUpdateInput{
  @IsString()
  groupName: string;

  @IsArray()
  @IsOptional()
  permissions: number[];
}