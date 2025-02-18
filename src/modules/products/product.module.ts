import { Module, forwardRef } from "@nestjs/common";
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
import { OrderProductModule } from "../orders-products/order-product.module";
import { ProductCategoryModule } from "../products-categories/product-category.module";
import { ClientFavouriteProductModule } from "../clients-favourites-products/client-favourite-product.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => UserModule),
    ImageModule,
    ProductWarehouseModule,
    OrderProductModule,
    forwardRef(() => ClientFavouriteProductModule),
    CategoryModule,
    ReviewModule,
    ProductCategoryModule,
  ],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
