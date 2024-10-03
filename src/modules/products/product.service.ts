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

  findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
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
