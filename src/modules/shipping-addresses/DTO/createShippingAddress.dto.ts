import { IsNotEmpty, IsString } from "class-validator";

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  readonly streetAddress!: string;

  @IsString()
  @IsNotEmpty()
  readonly houseNumber!: string;

  @IsString()
  readonly apartmentNumber!: string;

  @IsString()
  @IsNotEmpty()
  readonly city!: string;

  @IsString()
  @IsNotEmpty()
  readonly postalCode!: string;
}

export class CreateShippingAddressDto extends CreateAddressDto {}
