import { IsString, IsNumber, IsNotEmpty } from "class-validator";

import { PreviewProductDto } from "./previewProduct.dto";

export class listProudctDto extends PreviewProductDto {
  @IsNumber()
  @IsNotEmpty()
  averageRating!: number;

  @IsString()
  @IsNotEmpty()
  category!: string;
}
