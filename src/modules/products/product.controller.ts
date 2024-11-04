import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from "@nestjs/common";
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from "@nestjs/platform-express";
import { DetailProductEmployeeDto } from "./DTO/detailProductEmployee.dto";
import { DetailProductClientDto } from "./DTO/detailProductClient.dto";
import { ExtendedPreviewProductDto } from "./DTO/extendedPreviewProduct.dto";
import { PreviewProductDto } from "./DTO/previewProduct.dto";
import { PaymentProductDto } from "./DTO/paymentProduct.dto";
import { AddProductResponse } from "./responseType";
import { ProductService } from "./product.service";
import { Product } from "./product.entity";

@Controller("Products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get("all-with-thumbnails")
  async getAllWithThumbnails(): Promise<Product[]> {
    return await this.productService.getAllWithThumbnails();
  }

  @Post("extended-previews")
  async getExtendedPreviewsByIds(
    @Body("ids") ids: number[]
  ): Promise<ExtendedPreviewProductDto[]> {
    return await this.productService.getExtendedPreviews(ids);
  }

  @Post("previews")
  async getPreviewsByIds(
    @Body("ids") ids: number[]
  ): Promise<PreviewProductDto[]> {
    return await this.productService.getPreviews(ids);
  }

  @Get(":id")
  async getById(
    @Param("id") id: number
  ): Promise<DetailProductClientDto | null> {
    return await this.productService.getById(id);
  }

  @Post(":id/upload-files")
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(
    @Param("id") id: number,
    @UploadedFile()
    file: Express.Multer.File[]
  ): Promise<string[] | undefined> {
    return await this.productService.uploadFiles(id, file);
  }

  @Post("add")
  @UseInterceptors(FileFieldsInterceptor([{ name: "images", maxCount: 10 }]))
  async addProduct(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Body() body: any
  ): Promise<AddProductResponse> {
    const detailedProductDto: DetailProductEmployeeDto = {
      name: body.name,
      price: parseFloat(body.price),
      images: files.images || [],
      description: body.description,
      quantity: parseInt(body.quantity, 10),
    };

    return await this.productService.addProduct(detailedProductDto);
  }

  @Post("payment-details")
  async getPaymentDetails(
    @Body("ids") ids: number[]
  ): Promise<PaymentProductDto[]> {
    return await this.productService.getPaymentDetails(ids);
  }

  @Get(":id/managed-details")
  async getManagedDetails(
    @Param("id") id: number
  ): Promise<DetailProductEmployeeDto | null> {
    return await this.productService.getManagedDetails(id);
  }

  @Put("update")
  async manageProduct(
    @Param("id") id: number,
    @Body() body: DetailProductEmployeeDto
  ): Promise<Product | null> {
    return await this.productService.manageProduct(id, body);
  }
}
