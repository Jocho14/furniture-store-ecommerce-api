import { Injectable } from "@nestjs/common";
import { ClientFavouriteProductRepository } from "./client-favourite-product.repository";

@Injectable()
export class ClientFavouriteProductService {
  constructor(
    private readonly clientFavouriteProductRepository: ClientFavouriteProductRepository
  ) {}
}
