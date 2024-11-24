import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { ClientFavouriteProductRepository } from "./client-favourite-product.repository";
import { AuthenticatedUser } from "../../auth/interface/IAuth";
import { ClientFavouriteProduct } from "./client-favourite-product.entity";
import { ClientService } from "../clients/client.service";
import { ProductService } from "../products/product.service";
import { PreviewProductDto } from "../products/DTO/previewProduct.dto";

@Injectable()
export class ClientFavouriteProductService {
  constructor(
    private readonly clientFavouriteProductRepository: ClientFavouriteProductRepository,
    private readonly clientService: ClientService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService
  ) {}

  async addFavouriteProduct(req: AuthenticatedUser, productId: number) {
    if (!req.user) {
      return;
    }

    const clientId = await this.clientService.getClientId(req.user.user_id);
    if (!clientId) {
      return;
    }

    const clientFavouriteProduct = new ClientFavouriteProduct();
    clientFavouriteProduct.client_id = clientId;
    clientFavouriteProduct.product_id = productId;

    return await this.clientFavouriteProductRepository.add(
      clientFavouriteProduct
    );
  }

  async removeFavouriteProduct(req: AuthenticatedUser, productId: number) {
    if (!req.user) {
      return;
    }

    const clientId = await this.clientService.getClientId(req.user.user_id);
    if (!clientId) {
      return;
    }

    const clientFavouriteProduct = new ClientFavouriteProduct();
    clientFavouriteProduct.client_id = clientId;
    clientFavouriteProduct.product_id = productId;

    return await this.clientFavouriteProductRepository.remove(
      clientFavouriteProduct
    );
  }

  async checkFavouriteProduct(
    req: AuthenticatedUser,
    productId: number
  ): Promise<boolean> {
    if (!req.user) {
      return false;
    }

    const clientId = await this.clientService.getClientId(req.user.user_id);
    if (!clientId) {
      return false;
    }

    const clientFavouriteProduct = new ClientFavouriteProduct();
    clientFavouriteProduct.client_id = clientId;
    clientFavouriteProduct.product_id = productId;

    const result = await this.clientFavouriteProductRepository.check(
      clientFavouriteProduct
    );
    return result ? true : false;
  }

  async getAllFavouriteProducts(
    req: AuthenticatedUser
  ): Promise<PreviewProductDto[] | []> {
    if (!req.user) {
      return [];
    }

    const clientId = await this.clientService.getClientId(req.user.user_id);
    if (!clientId) {
      return [];
    }

    const productIds = await this.clientFavouriteProductRepository.getAll(
      clientId
    );

    const previews = await this.productService.getPreviews(productIds);
    return previews;
  }
}
