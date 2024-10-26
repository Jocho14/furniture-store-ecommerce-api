import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class BaseProductDto {
  public constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }

  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsNumber()
  @IsNotEmpty()
  readonly price!: number;
}
