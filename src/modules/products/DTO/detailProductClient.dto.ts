import { IsString, IsArray } from "class-validator";

import { BaseProductDto } from "./baseProduct.dto";

export class DetailProductClientDto extends BaseProductDto {
  @IsArray()
  readonly imageUrls!: string[];

  @IsString()
  readonly description!: string;
}
