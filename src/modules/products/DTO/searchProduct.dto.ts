import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class SearchProductDto {
  @IsNumber()
  readonly productId?: number;

  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly thumbnailUrl!: string;

  @IsString()
  @IsNotEmpty()
  readonly category!: string;
}
