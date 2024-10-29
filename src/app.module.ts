import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "./auth/auth.module";
import { AccountModule } from "./modules/accounts/account.module";
import { ProductModule } from "./modules/products/product.module";
import { WarehouseModule } from "./modules/warehouses/warehouse.module";
import { ProductWarehouseModule } from "./modules/products-warehouses/product-warehouse.module";

import * as dotenv from "dotenv";
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
    }),
    AuthModule,
    AccountModule,
    ProductModule,
    WarehouseModule,
    ProductWarehouseModule,
  ],
})
export class AppModule {}
