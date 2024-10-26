import { Injectable } from "@nestjs/common";
import { ProductRepository } from "./product.repository";
import { Product } from "./product.entity";
import { AddProductResponse } from "./responseType";
import { ImageService } from "../images/image.service";
import { DetailProductEmployeeDto } from "./DTO/detailProductEmployee.dto";
import { DetailProductClientDto } from "./DTO/detailProductClient.dto";
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

  async getById(id: number): Promise<DetailProductClientDto | null> {
    const product = await this.productRepository.getById(id);
    const imageUrls = await this.imageService.getImagesForProduct(id);
    const detailProductClientDto = {
      name: product?.name || "null",
      price: product?.price || 0,
      description: product?.description || "null",
      imageUrls: imageUrls?.map((image) => image.url) || [],
    };

    return detailProductClientDto;
  }

  async uploadFiles(
    id: number,
    files: Express.Multer.File[]
  ): Promise<string[] | undefined> {
    const imageDto = new ImageDto(id, files);
    return await this.imageService.uploadImages(imageDto);
  }

  async addProduct(
    detailProductEmployeeDto: DetailProductEmployeeDto
  ): Promise<AddProductResponse> {
    try {
      const product = new Product(
        detailProductEmployeeDto.name,
        detailProductEmployeeDto.price,
        detailProductEmployeeDto.description
      );
      const productId = await this.productRepository.addProduct(product);
      const imageDto = new ImageDto(productId, detailProductEmployeeDto.images);
      const images = await this.imageService.uploadImages(imageDto);

      const listProudctDto = {
        name: detailProductEmployeeDto.name,
        price: detailProductEmployeeDto.price,
        thumbnailUrl: images?.at(0) || "null",
      };

      return listProudctDto;
    } catch (error) {
      return { error: "An error occurred" };
    }
  }
}
