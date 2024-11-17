import { IsString, IsNumber, IsNotEmpty } from "class-validator";

import { PreviewProductDto } from "./previewProduct.dto";

export class listProudctDto extends PreviewProductDto {
  @IsNumber()
  @IsNotEmpty()
  readonly averageRating!: number;

  @IsString()
  @IsNotEmpty()
  readonly category!: string;
}
