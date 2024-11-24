import { Controller, Get, Post, Body } from "@nestjs/common";

import { ClientFavouriteProductService } from "./client-favourite-product.service";

@Controller("Clients-Favourites-Products")
export class ClientFavouriteProductController {
  constructor(
    private readonly clientFavouriteProductService: ClientFavouriteProductService
  ) {}
}
