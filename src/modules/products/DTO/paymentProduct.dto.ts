import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

import { BaseProductDto } from "./baseProduct.dto";

export class PaymentProductDto extends BaseProductDto {
  @IsNotEmpty()
  @IsNumber()
  productId!: number;

  @IsArray()
  imageUrls!: string[];
}
