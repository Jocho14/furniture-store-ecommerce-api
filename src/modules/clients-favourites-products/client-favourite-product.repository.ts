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
}
