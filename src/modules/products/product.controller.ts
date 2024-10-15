import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Headers,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { ProductService } from "./product.service";
import { Product } from "./product.entity";

@Controller("Products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get("all-with-thumbnails")
  async getAllWithThumbnails(): Promise<Product[]> {
    return await this.productService.getAllWithThumbnails();
  }

  @Get(":id")
  async getById(@Param("id") id: number): Promise<Product | null> {
    return await this.productService.getById(id);
  }

  @Post(":id/upload-file")
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(
    @Param("id") id: number,
    @UploadedFile()
    file: Express.Multer.File
  ): Promise<string | undefined> {
    return await this.productService.uploadFile(id, file);
  }
}
