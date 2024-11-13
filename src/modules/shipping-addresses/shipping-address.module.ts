import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ShippingAddress } from "./shipping-address.entity";
import { ShippingAddressService } from "./shipping-address.service";
import { ShippingAddressController } from "./shipping-address.controller";
import { ShippingAddressRepository } from "./shipping-address.repository";

@Module({
  imports: [TypeOrmModule.forFeature([ShippingAddress])],
  providers: [ShippingAddressService, ShippingAddressRepository],
  controllers: [ShippingAddressController],
  exports: [ShippingAddressService],
})
export class ShippingAddressModule {}
