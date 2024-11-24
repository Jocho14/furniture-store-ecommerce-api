import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";

import { Product } from "../products/product.entity";
import { Client } from "../clients/client.entity";

@Entity("clients_favourites_products")
export class ClientFavouriteProduct {
  @PrimaryColumn()
  client_id!: number;

  @PrimaryColumn()
  product_id!: number;

  @ManyToOne(() => Client, (client) => client.favouriteProducts)
  @JoinColumn({ name: "client_id" })
  client!: Client;

  @ManyToOne(() => Product, (product) => product.favouriteProducts)
  @JoinColumn({ name: "product_id" })
  product!: Product;
}
