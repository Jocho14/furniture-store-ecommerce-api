import { IsString, IsArray, IsNumber } from "class-validator";

import { BaseProductDto } from "./baseProduct.dto";

export class DetailProductEmployeeDto extends BaseProductDto {
  @IsArray()
  readonly images!: Express.Multer.File[];

  @IsString()
  readonly description!: string;

  @IsNumber()
  readonly quantity!: number;
}
