import { IsString, IsNumber, IsNotEmpty } from "class-validator";
export class BasicProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsNumber()
  readonly price!: number;

  @IsString()
  readonly description!: string;
}
