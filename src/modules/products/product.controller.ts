import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Headers,
} from "@nestjs/common";
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from "@nestjs/platform-express";
import { DetailedProductDto } from "./DTO/detailedProduct.dto";

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

  @Post(":id/upload-files")
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(
    @Param("id") id: number,
    @UploadedFile()
    file: Express.Multer.File[]
  ): Promise<string | undefined> {
    return await this.productService.uploadFiles(id, file);
  }

  @Post("add")
  @UseInterceptors(FileFieldsInterceptor([{ name: "images", maxCount: 10 }]))
  async addProduct(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Body() body: any
  ): Promise<string> {
    const detailedProductDto: DetailedProductDto = {
      images: files.images || [],
      details: {
        name: body.details.name,
        price: parseFloat(body.details.price),
        description: body.details.description,
      },
      quantity: parseInt(body.quantity, 10),
    };
    return await this.productService.addProduct(detailedProductDto);
  }
}
