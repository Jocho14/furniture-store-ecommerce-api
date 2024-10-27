import { IsNotEmpty, IsNumber } from "class-validator";

import { PreviewProductDto } from "./previewProduct.dto";

export class ExtendedPreviewProductDto extends PreviewProductDto {
  @IsNumber()
  @IsNotEmpty()
  readonly quantity!: number;
}
