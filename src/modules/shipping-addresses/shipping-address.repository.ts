import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { ShippingAddress } from "./shipping-address.entity";
import { CreateShippingAddressDto } from "./DTO/createShippingAddress.dto";

@Injectable()
export class ShippingAddressRepository {
  constructor(
    @InjectRepository(ShippingAddress)
    private readonly repository: Repository<ShippingAddress>
  ) {}

  async create(shippingAddress: ShippingAddress): Promise<ShippingAddress> {
    return await this.repository.save(shippingAddress);
  }
}
