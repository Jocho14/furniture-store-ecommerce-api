import { IsString, IsNotEmpty, IsArray } from "class-validator";

export class MasonryDto {
  constructor(name: string, imageUrls: string[]) {
    this.name = name;
    this.imageUrls = imageUrls;
  }

  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsArray()
  @IsNotEmpty()
  readonly imageUrls!: string[];
}
