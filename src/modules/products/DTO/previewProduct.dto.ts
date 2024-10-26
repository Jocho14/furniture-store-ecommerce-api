import { IsString, IsNotEmpty } from "class-validator";

import { BaseProductDto } from "./baseProduct.dto";

export class PreviewProductDto extends BaseProductDto {
  @IsString()
  @IsNotEmpty()
  readonly thumbnailUrl!: string;
}
