import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class AccountBasicInfoDto {
  constructor(accountId: number, role: string, firstName: string) {
    this.accountId = accountId;
    this.role = role;
    this.firstName = firstName;
  }

  @IsNumber()
  @IsNotEmpty()
  readonly accountId!: number;

  @IsString()
  @IsNotEmpty()
  readonly role!: string;

  @IsString()
  @IsNotEmpty()
  readonly firstName!: string;
}
