import { IsString, IsNotEmpty } from "class-validator";
export class ProductWithThumbnailDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsNotEmpty()
  readonly thumbnailUrl!: string;
}
