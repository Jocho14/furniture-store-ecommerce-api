import * as dotenv from "dotenv";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "./modules/users/user.module";
import { AuthModule } from "./auth/auth.module";
import { AccountModule } from "./modules/accounts/account.module";
import { ProductModule } from "./modules/products/product.module";
import { WarehouseModule } from "./modules/warehouses/warehouse.module";
import { ProductWarehouseModule } from "./modules/products-warehouses/product-warehouse.module";
import { CategoryModule } from "./modules/categories/category.module";
import { ReviewModule } from "./modules/reviews/review.module";
import { OrderProductModule } from "./modules/orders-products/order-product.module";
import { OrderModule } from "./modules/orders/order.module";
import { ShippingAddressModule } from "./modules/shipping-addresses/shipping-address.module";

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: false, // set to false in production
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    AuthModule,
    AccountModule,
    ProductModule,
    WarehouseModule,
    ProductWarehouseModule,
    UserModule,
    CategoryModule,
    ReviewModule,
    OrderProductModule,
    OrderModule,
    ShippingAddressModule,
  ],
})
export class AppModule {}
