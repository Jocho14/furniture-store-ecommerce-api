import { IsString, IsArray } from "class-validator";

import { BaseProductDto } from "./baseProduct.dto";

export class DetailProductClientDto extends BaseProductDto {
  @IsArray()
  imageUrls!: string[];

  @IsString()
  description!: string;
}
