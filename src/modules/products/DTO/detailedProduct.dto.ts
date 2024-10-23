import { BasicProductDto } from "./basicProduct.dto";
import { ValidateNested } from "class-validator";
import { IsArray, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class DetailedProductDto {
  @IsArray()
  readonly images!: Express.Multer.File[];

  @ValidateNested()
  @Type(() => BasicProductDto)
  readonly details!: BasicProductDto;

  @IsNumber()
  readonly quantity!: number;
}
