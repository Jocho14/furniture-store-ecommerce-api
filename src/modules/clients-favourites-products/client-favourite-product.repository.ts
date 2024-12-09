import { Repository, In } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientFavouriteProduct } from "./client-favourite-product.entity";

@Injectable()
export class ClientFavouriteProductRepository {
  constructor(
    @InjectRepository(ClientFavouriteProduct)
    private readonly repository: Repository<ClientFavouriteProduct>
  ) {}

  async add(clientFavouriteProduct: ClientFavouriteProduct) {
    return await this.repository.save(clientFavouriteProduct);
  }

  async remove(clientFavouriteProduct: ClientFavouriteProduct) {
    return await this.repository.remove(clientFavouriteProduct);
  }

  async check(
    clientFavouriteProduct: ClientFavouriteProduct
  ): Promise<ClientFavouriteProduct | null> {
    return await this.repository.findOne({
      where: {
        client_id: clientFavouriteProduct.client_id,
        product_id: clientFavouriteProduct.product_id,
      },
    });
  }

  async getAll(clientId: number): Promise<number[]> {
    const favouriteProducts = await this.repository.find({
      where: {
        client_id: clientId,
      },
    });

    return favouriteProducts.map(
      (favouriteProduct) => favouriteProduct.product_id
    );
  }

  async deleteAll(): Promise<void> {
    await this.repository.delete({});
  }
}
