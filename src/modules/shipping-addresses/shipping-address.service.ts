import { Injectable } from "@nestjs/common";
import { ShippingAddressRepository } from "./shipping-address.repository";

import { CreateShippingAddressDto } from "./DTO/createShippingAddress.dto";
import { ShippingAddress } from "./shipping-address.entity";

@Injectable()
export class ShippingAddressService {
  constructor(
    private readonly shippingAddressRepository: ShippingAddressRepository
  ) {}

  async createShippingAddress(
    createShippingAddressDto: CreateShippingAddressDto
  ): Promise<ShippingAddress> {
    const shippingAddress = new ShippingAddress(
      createShippingAddressDto.streetAddress,
      createShippingAddressDto.houseNumber,
      createShippingAddressDto.city,
      createShippingAddressDto.postalCode,
      createShippingAddressDto.apartmentNumber
    );
    return await this.shippingAddressRepository.create(shippingAddress);
  }
}
