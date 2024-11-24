import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class UserOrderInfoDto {
  @IsNumber()
  @IsString()
  firstName!: string;

  @IsNumber()
  @IsString()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;
}
