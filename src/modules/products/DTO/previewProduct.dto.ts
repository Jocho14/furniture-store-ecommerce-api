import { IsString, IsNumber, IsNotEmpty } from "class-validator";

import { BaseProductDto } from "./baseProduct.dto";

export class PreviewProductDto extends BaseProductDto {
  @IsNumber()
  readonly productId?: number;

  @IsString()
  @IsNotEmpty()
  readonly thumbnailUrl!: string;
}
