import { IsNumber, IsNotEmpty, IsArray } from "class-validator";

export class ImageDto {
  constructor(productId: number, files: Express.Multer.File[]) {
    this.productId = productId;
    this.files = files;
  }
  @IsNumber()
  @IsNotEmpty()
  readonly productId!: number;

  @IsArray()
  @IsNotEmpty()
  readonly files!: Express.Multer.File[];
}
