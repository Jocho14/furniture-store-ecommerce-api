import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { ProductRepository } from "./product.repository";
import { ImageModule } from "../images/image.module";
import { ProductWarehouseModule } from "../products-warehouses/product-warehouse.module";
import { CategoryModule } from "../categories/category.module";
import { ReviewModule } from "../reviews/review.module";
import { UserModule } from "../users/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ImageModule,
    ProductWarehouseModule,
    CategoryModule,
    ReviewModule,
    UserModule,
  ],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
})
export class ProductModule {}
