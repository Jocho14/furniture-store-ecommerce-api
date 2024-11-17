import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EmployeeOrderPreviewDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id!: number;

  @IsString()
  @IsNotEmpty()
  readonly status!: string;

  @IsString()
  @IsNotEmpty()
  readonly email!: string | undefined;

  @IsNumber()
  @IsNotEmpty()
  readonly amount!: number;

  @IsNotEmpty()
  readonly date!: Date;
}
