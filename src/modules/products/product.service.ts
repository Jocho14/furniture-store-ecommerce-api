import { Injectable } from "@nestjs/common";
import { ProductRepository } from "./product.repository";
import { Product } from "./product.entity";
import { AddProductResponse } from "./responseType";
import { ImageService } from "../images/image.service";
import { DetailedProductDto } from "./DTO/detailedProduct.dto";
import { ImageDto } from "../images/DTO/image.dto";

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

  async getById(id: number): Promise<Product | null> {
    return await this.productRepository.getById(id);
  }

  async uploadFiles(
    id: number,
    files: Express.Multer.File[]
  ): Promise<string[] | undefined> {
    const imageDto = new ImageDto(id, files);
    return await this.imageService.uploadImages(imageDto);
  }

  async addProduct(
    detailedProductDto: DetailedProductDto
  ): Promise<AddProductResponse> {
    try {
      const product = new Product(
        detailedProductDto.details.name,
        detailedProductDto.details.price,
        detailedProductDto.details.description
      );
      const productId = await this.productRepository.addProduct(product);
      const imageDto = new ImageDto(productId, detailedProductDto.images);
      const images = await this.imageService.uploadImages(imageDto);

      return { name: product.name, thumbnailUrl: images?.at(0) || "null" };
    } catch (error) {
      return { error: "An error occurred" };
    }
  }
}
