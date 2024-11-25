import { IsNotEmpty } from "class-validator";

import { CreateGuestDto } from "../../guests/DTO/createGuest.dto";
import { CreateShippingAddressDto } from "../../shipping-addresses/DTO/createShippingAddress.dto";
import { OrderProductDto } from "../../orders-products/DTO/orderProduct.dto";

export class CreateClientOrderDto {
  @IsNotEmpty()
  readonly shippingAddressDto!: CreateShippingAddressDto;

  @IsNotEmpty()
  readonly orderProductDtos!: OrderProductDto[];
}
