import { IsString, IsNotEmpty } from "class-validator";

export class AccountCreateDto {
  @IsString()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}
