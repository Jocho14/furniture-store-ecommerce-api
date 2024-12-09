import { IsString, IsNotEmpty, IsDate } from "class-validator";
import { AccountCreateDto } from "../../accounts/DTO/accountCreate.dto";

export class UserCreateDto {
  @IsNotEmpty()
  account!: AccountCreateDto;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsDate()
  @IsNotEmpty()
  dateOfBirth!: Date;
}

export class EmployeeCreateDto extends UserCreateDto {
  @IsString()
  @IsNotEmpty()
  secret!: string;
}
