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

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(":id")
  getById(@Param("id") id: number): Promise<Product | null> {
    return this.productService.getById(id);
  }

  @Post(":id/upload-file")
  @UseInterceptors(FileInterceptor("file"))
  uploadImage(
    @Param("id") id: number,
    @UploadedFile()
    file: Express.Multer.File
  ): Promise<string | undefined> {
    return this.productService.uploadFile(id, file);
  }
}
