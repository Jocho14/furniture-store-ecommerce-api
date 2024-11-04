import { IsString, IsNotEmpty, IsDate } from "class-validator";
import { AccountCreateDto } from "../../accounts/DTO/accountCreate.dto";

export class UserCreateDto {
  @IsNotEmpty()
  readonly account!: AccountCreateDto;

  @IsString()
  @IsNotEmpty()
  readonly firstName!: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName!: string;

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber!: string;

  @IsDate()
  @IsNotEmpty()
  readonly dateOfBirth!: Date;
}
