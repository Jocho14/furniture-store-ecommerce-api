import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

import { BaseProductDto } from "./baseProduct.dto";

export class PaymentProductDto extends BaseProductDto {
  @IsNotEmpty()
  @IsNumber()
  readonly productId!: number;

  @IsArray()
  readonly imageUrls!: string[];
}
