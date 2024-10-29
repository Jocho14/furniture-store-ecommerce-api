import { IsString, IsNotEmpty } from "class-validator";

export class LoginPayloadDto {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
