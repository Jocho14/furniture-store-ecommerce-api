import { IsString, IsArray, IsNumber } from "class-validator";

import { BaseProductDto } from "./baseProduct.dto";

export class DetailProductEmployeeDto extends BaseProductDto {
  @IsArray()
  readonly images!: Express.Multer.File[] | string[];

  @IsString()
  readonly description!: string;

  @IsNumber()
  readonly quantity!: number;

  @IsString()
  readonly category!: string;
}
