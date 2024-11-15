import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LineItemDto {
  @IsNumber()
  @IsNotEmpty()
  readonly productId!: number;

  @IsNumber()
  @IsNotEmpty()
  readonly quantity!: number;

  @IsString()
  @IsNotEmpty()
  readonly name!: number;

  @IsNumber()
  @IsNotEmpty()
  readonly price!: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  readonly imageUrls!: string[];
}
