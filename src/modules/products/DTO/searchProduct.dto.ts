import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class SearchProductDto {
  @IsNumber()
  productId?: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  thumbnailUrl!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;
}
