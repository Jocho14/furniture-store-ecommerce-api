import { IsString, IsArray, IsNumber } from "class-validator";

import { BaseProductDto } from "./baseProduct.dto";

export class DetailProductEmployeeDto extends BaseProductDto {
  @IsArray()
  images!: Express.Multer.File[] | string[];

  @IsString()
  description!: string;

  @IsNumber()
  quantity!: number;

  @IsString()
  category!: string;
}
