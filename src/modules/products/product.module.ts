import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { ProductRepository } from "./product.repository";
import { ImageModule } from "../images/image.module";
import { ProductWarehouseModule } from "../products-warehouses/product-warehouse.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ImageModule,
    ProductWarehouseModule,
  ],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
})
export class ProductModule {}
