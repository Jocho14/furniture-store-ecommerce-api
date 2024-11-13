import { IsNotEmpty, IsString } from "class-validator";

export class CreateGuestDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName!: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName!: string;

  @IsString()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber!: string;
}
