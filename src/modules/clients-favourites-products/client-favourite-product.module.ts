import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientFavouriteProduct } from "./client-favourite-product.entity";
import { ClientFavouriteProductService } from "./client-favourite-product.service";
import { ClientFavouriteProductRepository } from "./client-favourite-product.repository";
import { ClientFavouriteProductController } from "./client-favourite-product.controller";
import { ClientModule } from "../clients/client.module";
import { ProductModule } from "../products/product.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientFavouriteProduct]),
    forwardRef(() => ClientModule),
    forwardRef(() => ProductModule),
  ],
  providers: [ClientFavouriteProductService, ClientFavouriteProductRepository],
  controllers: [ClientFavouriteProductController],
  exports: [ClientFavouriteProductService],
})
export class ClientFavouriteProductModule {}
