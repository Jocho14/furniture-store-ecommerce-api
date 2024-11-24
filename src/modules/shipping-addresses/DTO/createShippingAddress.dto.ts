import { IsNotEmpty, IsString } from "class-validator";

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  streetAddress!: string;

  @IsString()
  @IsNotEmpty()
  houseNumber!: string;

  @IsString()
  apartmentNumber!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  postalCode!: string;
}

export class CreateShippingAddressDto extends CreateAddressDto {}
export class ShippingAddressOrderDto extends CreateShippingAddressDto {}
