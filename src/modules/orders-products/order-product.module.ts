import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderProduct } from "./order-product.entity";
import { OrderProductService } from "./order-product.service";
import { OrderProductRepository } from "./order-product.repository";
import { OrderProductController } from "./order-product.controller";

@Module({
  imports: [TypeOrmModule.forFeature([OrderProduct])],
  providers: [OrderProductService, OrderProductRepository],
  controllers: [OrderProductController],
  exports: [OrderProductService],
})
export class OrderProductModule {}
