import { IsString, IsNotEmpty, IsArray } from "class-validator";

export class HorizontalTilesDto {
  constructor(name: string, imageUrl: string) {
    this.name = name;
    this.imageUrl = imageUrl;
  }

  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsArray()
  @IsNotEmpty()
  readonly imageUrl!: string;
}
