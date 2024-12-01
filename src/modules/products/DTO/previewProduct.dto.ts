import { IsString, IsNumber, IsNotEmpty } from "class-validator";

import { BaseProductDto } from "./baseProduct.dto";

export class PreviewProductDto extends BaseProductDto {
  @IsNumber()
  productId?: number;

  @IsString()
  @IsNotEmpty()
  thumbnailUrl!: string;
}
