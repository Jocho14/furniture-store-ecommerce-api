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
import { GetReviewDto } from "../reviews/DTO/getReview.dto";
import { CreateReviewDto } from "../reviews/DTO/createReview.dto";
import { Request } from "express";
import { JwtGuard } from "../../auth/guards/jwt.guard";

import {
  AddProductResponse,
  UpdateProductResponse,
  DeactivateProductResponse,
} from "./responseType";

import { ProductService } from "./product.service";

@Controller("Products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get("all-with-thumbnails")
  async getAllWithThumbnails(): Promise<any[]> {
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
    file: Express.Multer.File[]
  ): Promise<string[] | undefined> {
    return await this.productService.uploadFiles(id, file);
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
  @UseGuards(JwtGuard)
  async addReview(
    @Req() req: Request,
    @Param("id") productId: number,
    @Body() body: CreateReviewDto
  ): Promise<any> {
    return await this.productService.addReview(productId, body, req.user);
  }
}
