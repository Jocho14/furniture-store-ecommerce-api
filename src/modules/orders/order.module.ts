import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientModule } from "../clients/client.module";
import { GuestModule } from "../guests/guest.module";
import { ShippingAddressModule } from "../shipping-addresses/shipping-address.module";

import { Order } from "./order.entity";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { OrderRepository } from "./order.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ClientModule,
    GuestModule,
    ShippingAddressModule,
  ],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
