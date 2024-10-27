import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductWarehouse } from "./product-warehouse.entity";
import { ProductWarehouseService } from "./product-warehouse.service";
import { ProductWarehouseRepository } from "./product-warehouse.repository";
import { ProductWarehouseController } from "./product-warehouse.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ProductWarehouse])],
  providers: [ProductWarehouseService, ProductWarehouseRepository],
  controllers: [ProductWarehouseController],
  exports: [ProductWarehouseService],
})
export class ProductWarehouseModule {}
