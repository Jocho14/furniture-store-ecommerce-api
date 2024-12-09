import { IsString, IsNotEmpty } from "class-validator";

export class AccountCreateDto {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
