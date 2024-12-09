import { Controller, Get, Post, Body, Req, Param } from "@nestjs/common";

import { ClientFavouriteProductService } from "./client-favourite-product.service";
import { AuthenticatedUser } from "../../auth/interface/IAuth";
import { UseGuards } from "@nestjs/common";
import { ClientGuard } from "../../auth/guards/client.guard";
import { PreviewProductDto } from "../products/DTO/previewProduct.dto";

@Controller("Clients-Favourites-Products")
export class ClientFavouriteProductController {
  constructor(
    private readonly clientFavouriteProductService: ClientFavouriteProductService
  ) {}

  @Post(":id/add")
  @UseGuards(ClientGuard)
  async addFavouriteProduct(
    @Req() req: AuthenticatedUser,
    @Param("id") productId: number
  ) {
    if (!req) {
      return;
    }
    return await this.clientFavouriteProductService.addFavouriteProduct(
      req,
      productId
    );
  }

  @Post(":id/remove")
  @UseGuards(ClientGuard)
  async removeFavouriteProduct(
    @Req() req: AuthenticatedUser,
    @Param("id") productId: number
  ) {
    if (!req) {
      return;
    }
    return await this.clientFavouriteProductService.removeFavouriteProduct(
      req,
      productId
    );
  }

  @Get(":id/check")
  @UseGuards(ClientGuard)
  async checkFavouriteProduct(
    @Req() req: AuthenticatedUser,
    @Param("id") productId: number
  ): Promise<{isFavourite: boolean}> {
    if (!req) {
      return {isFavourite: false};
    }
    const result = await this.clientFavouriteProductService.checkFavouriteProduct(req, productId);
    return {isFavourite: result};
  }

  @Get("all")
  @UseGuards(ClientGuard)
  async getAllFavouriteProducts(
    @Req() req: AuthenticatedUser
  ): Promise<PreviewProductDto[] | []> {
    if (!req) {
      return [];
    }
    return await this.clientFavouriteProductService.getAllFavouriteProducts(
      req
    );
  }
}
