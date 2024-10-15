import { Injectable } from "@nestjs/common";
import { ProductRepository } from "./product.repository";
import { Product } from "./product.entity";

import { ImageService } from "../images/image.service";

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly imageService: ImageService
  ) {}

  async getAllWithThumbnails(): Promise<any> {
    const allProducts = await this.productRepository.getAll();
    const productsWithThumbnails = await Promise.all(
      allProducts.map(async (product) => {
        const thumbnail = await this.imageService.getThumbnailForProduct(
          product.product_id
        );
        return {
          name: product.name,
          price: product.price,
          thumbnail: thumbnail?.url || "null",
          alt: thumbnail?.alt || "null",
        };
      })
    );

    return productsWithThumbnails;
  }

  getById(id: number): Promise<Product | null> {
    return this.productRepository.getById(id);
  }

  uploadFile(
    id: number,
    file: Express.Multer.File
  ): Promise<string | undefined> {
    return this.imageService.uploadImage(id, file);
  }
}
