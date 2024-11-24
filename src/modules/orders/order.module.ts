import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientModule } from "../clients/client.module";
import { GuestModule } from "../guests/guest.module";
import { ShippingAddressModule } from "../shipping-addresses/shipping-address.module";

import { Order } from "./order.entity";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { OrderRepository } from "./order.repository";
import { OrderProductModule } from "../orders-products/order-product.module";
import { ProductModule } from "../products/product.module";
import { UserModule } from "../users/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ClientModule,
    GuestModule,
    ShippingAddressModule,
    OrderProductModule,
    ProductModule,
    UserModule,
  ],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
