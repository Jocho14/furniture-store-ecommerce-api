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
  Req,
  UseGuards,
  Query,
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
import { CreateReviewDto } from "../reviews/DTO/createReview.dto";
import { ClientGuard } from "../../auth/guards/client.guard";
import { AuthenticatedUser } from "../../auth/interface/IAuth";
import { BadRequestException } from "@nestjs/common";
import { listProudctDto } from "./DTO/listProduct.dto";
import { EmployeeGuard } from "../../auth/guards/employee.guard";

import {
  AddProductResponse,
  UpdateProductResponse,
  DeactivateProductResponse,
} from "./responseType";

import { ProductService } from "./product.service";
import { Product } from "./product.entity";

@Controller("Products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("extended-previews")
  async getExtendedPreviewsByIds(
    @Body("ids") ids: number[]
  ): Promise<ExtendedPreviewProductDto[]> {
    return await this.productService.getExtendedPreviews(ids);
  }

  @Get(":id/check-active")
  async getProductById(
    @Param("id") id: number
  ): Promise<{ isActive: boolean }> {
    const result = await this.productService.isProductActive(id);
    return { isActive: result };
  }

  @Get("all-with-thumbnails")
  @UseGuards(EmployeeGuard)
  async getAllWithThumbnails() {
    return await this.productService.getAllWithThumbnails();
  }

  @Post("previews")
  async getPreviewsByIds(
    @Body("ids") ids: number[]
  ): Promise<PreviewProductDto[]> {
    return await this.productService.getPreviews(ids);
  }

  @Get("list")
  async getList(): Promise<listProudctDto[]> {
    return await this.productService.getList();
  }

  @Get(":id/details/client")
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
    files: Express.Multer.File[]
  ): Promise<string[] | undefined> {
    return await this.productService.uploadFiles(id, files);
  }

  @Post(":id/test/upload-files")
  @UseInterceptors(FileInterceptor("file"))
  async uploadTestImage(
    @Param("id") id: number,
    @UploadedFile()
    files: Express.Multer.File[]
  ): Promise<string[] | undefined> {
    return await this.productService.uploadTestFiles(id, files);
  }

  @Post("add")
  @UseInterceptors(FileFieldsInterceptor([{ name: "images", maxCount: 10 }]))
  async add(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Body() body: any
  ): Promise<AddProductResponse> {
    const detailedProductDto: DetailProductEmployeeDto = {
      name: body.name,
      price: parseFloat(body.price),
      images: files.images || [],
      description: body.description,
      quantity: parseInt(body.quantity, 10),
      category: body.category,
    };

    return await this.productService.add(detailedProductDto);
  }

  @Post("payment-details")
  async getPaymentDetails(
    @Body("ids") ids: number[]
  ): Promise<PaymentProductDto[]> {
    return await this.productService.getPaymentDetails(ids);
  }

  @Get(":id/details/employee")
  async getManagedDetails(
    @Param("id") id: number
  ): Promise<DetailProductEmployeeDto | null> {
    return await this.productService.getManagedDetails(id);
  }

  @Put(":id/update")
  @UseInterceptors(FileFieldsInterceptor([{ name: "images", maxCount: 10 }]))
  async update(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Param("id") id: number,
    @Body() body: any
  ): Promise<UpdateProductResponse> {
    const detailedProductDto: DetailProductEmployeeDto = {
      name: body.name,
      price: parseFloat(body.price),
      images: files.images || [],
      description: body.description,
      quantity: parseInt(body.quantity, 10),
      category: body.category,
    };

    return await this.productService.update(id, detailedProductDto);
  }

  @Put(":id/deactivate")
  async deactivate(
    @Param("id") id: number
  ): Promise<DeactivateProductResponse> {
    return await this.productService.deactivate(id);
  }

  @Get(":id/reviews")
  async getReviews(@Param("id") id: number): Promise<any[]> {
    return await this.productService.getReviews(id);
  }

  @Post(":id/add-review")
  @UseGuards(ClientGuard)
  async addReview(
    @Req() req: AuthenticatedUser,
    @Param("id") productId: number,
    @Body() body: CreateReviewDto
  ): Promise<any> {
    if (!req.user) {
      return null;
    }

    return await this.productService.addReview(productId, body, req);
  }

  @Get("prices")
  async getPrices(@Query("ids") ids: number[]): Promise<any[]> {
    return await this.productService.getPrices(ids);
  }

  @Get("search")
  async searchProducts(@Query("query") query: string) {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException("Query parameter is required");
    }

    return await this.productService.searchProducts(query.trim());
  }
}
