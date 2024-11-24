import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

import { UserOrderInfoDto } from "../../users/DTO/userOrderInfo.dto";
import { ExtendedPreviewProductDto } from "../../products/DTO/extendedPreviewProduct.dto";
import { ShippingAddressOrderDto } from "../../shipping-addresses/DTO/createShippingAddress.dto";

export class EmployeeOrderManageDto {
  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsString()
  @IsNotEmpty()
  date!: Date;

  @IsNotEmpty()
  customer!: UserOrderInfoDto;

  @IsNumber()
  @IsArray()
  products!: ExtendedPreviewProductDto[];

  @IsNotEmpty()
  shipping!: ShippingAddressOrderDto;
}
