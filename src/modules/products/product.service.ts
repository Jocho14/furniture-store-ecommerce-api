import { Injectable } from "@nestjs/common";

import { Product } from "./product.entity";

import { ProductRepository } from "./product.repository";

import {
  AddProductResponse,
  UpdateProductResponse,
  DeactivateProductResponse,
} from "./responseType";

import { ImageService } from "../images/image.service";
import { ProductWarehouseService } from "../products-warehouses/product-warehouse.service";

import { ImageDto } from "../images/DTO/image.dto";
import { PreviewProductDto } from "./DTO/previewProduct.dto";
import { PaymentProductDto } from "./DTO/paymentProduct.dto";
import { DetailProductClientDto } from "./DTO/detailProductClient.dto";
import { DetailProductEmployeeDto } from "./DTO/detailProductEmployee.dto";
import { ExtendedPreviewProductDto } from "./DTO/extendedPreviewProduct.dto";
import { ReviewService } from "../reviews/review.service";
import { GetReviewDto } from "../reviews/DTO/getReview.dto";
import { CreateReviewDto } from "../reviews/DTO/createReview.dto";
import { UserService } from "../users/user.service";

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly imageService: ImageService,
    private readonly productWarehouseService: ProductWarehouseService,
    private readonly reviewService: ReviewService,
    private readonly userService: UserService
  ) {}

  async getAllWithThumbnails(): Promise<any> {
    const allProducts = await this.productRepository.getAll();
    const productsWithThumbnails = await Promise.all(
      allProducts.map(async (product) => {
        const thumbnail = await this.imageService.getThumbnailForProduct(
          product.product_id
        );
        const quantity = await this.productWarehouseService.getQuantity(
          product.product_id
        );
        return {
          id: product.product_id,
          name: product.name,
          price: product.price,
          thumbnail: thumbnail?.url || "null",
          alt: thumbnail?.alt || "null",
          quantity: quantity || 0,
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

  async getExtendedPreviews(
    ids: number[]
  ): Promise<ExtendedPreviewProductDto[]> {
    const products = await this.productRepository.getByIds(ids);
    if (!products) {
      return [];
    }
    const extendedPreviews = await Promise.all(
      products.map(async (product) => {
        const thumbnail = await this.imageService.getThumbnailForProduct(
          product.product_id
        );
        const quantity = await this.productWarehouseService.getQuantity(
          product.product_id
        );
        return {
          productId: product.product_id,
          name: product.name,
          price: product.price,
          thumbnailUrl: thumbnail?.url || "null",
          quantity: quantity || 0,
        };
      })
    );
    return extendedPreviews;
  }

  async getPreviews(ids: number[]): Promise<PreviewProductDto[]> {
    const products = await this.productRepository.getByIds(ids);
    if (!products) {
      return [];
    }
    const previews = await Promise.all(
      products.map(async (product) => {
        const thumbnail = await this.imageService.getThumbnailForProduct(
          product.product_id
        );
        return {
          productId: product.product_id,
          name: product.name,
          price: product.price,
          thumbnailUrl: thumbnail?.url || "null",
        };
      })
    );
    return previews;
  }

  async uploadFiles(
    id: number,
    files: Express.Multer.File[]
  ): Promise<string[] | undefined> {
    const imageDto = new ImageDto(id, files);
    return await this.imageService.uploadImages(imageDto);
  }

  async add(
    detailProductEmployeeDto: DetailProductEmployeeDto
  ): Promise<AddProductResponse> {
    try {
      const product = new Product(
        detailProductEmployeeDto.name,
        detailProductEmployeeDto.price,
        detailProductEmployeeDto.description
      );
      const productId = await this.productRepository.add(product);
      await this.productWarehouseService.setQuantity(
        productId,
        detailProductEmployeeDto.quantity
      );
      const imageFiles =
        detailProductEmployeeDto.images as Express.Multer.File[];

      const imageDto = new ImageDto(productId, imageFiles);
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

  async getPaymentDetails(ids: number[]): Promise<PaymentProductDto[]> {
    const products = await this.productRepository.getByIds(ids);
    if (!products) {
      return [];
    }
    const paymentDetails = await Promise.all(
      products.map(async (product) => {
        const imageUrls = await this.imageService.getImageUrlsForProduct(
          product.product_id
        );
        return {
          productId: product.product_id,
          name: product.name,
          price: product.price,
          imageUrls: imageUrls || [],
        };
      })
    );
    return paymentDetails;
  }

  async getManagedDetails(
    productId: number
  ): Promise<DetailProductEmployeeDto | null> {
    const product = await this.productRepository.getById(productId);
    if (!product) {
      return null;
    }
    const imageFiles = await this.imageService.getImageUrlsForProduct(
      productId
    );
    const quantity = await this.productWarehouseService.getQuantity(productId);
    const detailProductEmployeeDto = {
      name: product.name,
      price: product.price,
      description: product.description,
      quantity: quantity || 0,
      images: imageFiles || [],
    };

    return detailProductEmployeeDto;
  }

  async update(
    productId: number,
    detailedProductDto: DetailProductEmployeeDto
  ): Promise<UpdateProductResponse> {
    try {
      const product = new Product(
        detailedProductDto.name,
        detailedProductDto.price,
        detailedProductDto.description
      );

      product.product_id = productId;

      await this.imageService.deleteAllImages(productId);
      const images = await this.imageService.uploadImages(
        new ImageDto(
          productId,
          detailedProductDto.images as Express.Multer.File[]
        )
      );
      await this.productWarehouseService.updateQuantity(
        productId,
        detailedProductDto.quantity
      );

      await this.productRepository.update(product);

      const listProudctDto = {
        name: detailedProductDto.name,
        price: detailedProductDto.price,
        thumbnailUrl: images?.at(0) || "null",
      };

      return listProudctDto;
    } catch (error) {
      return { error: "An error occurred" };
    }
  }

  async deactivate(productId: number): Promise<DeactivateProductResponse> {
    try {
      await this.productWarehouseService.updateQuantity(productId, 0);
      await this.productRepository.deactivate(productId);
      const product = await this.productRepository.getById(productId);
      const thumbnail = await this.imageService.getThumbnailForProduct(
        productId
      );

      const listProudctDto = {
        name: product?.name || "null",
        price: product?.price || 0,
        thumbnailUrl: thumbnail?.url || "null",
      };
      return listProudctDto;
    } catch (error) {
      return { error: "An error occurred" };
    }
  }

  async getReviews(productId: number): Promise<GetReviewDto[]> {
    return await this.reviewService.getReviewsForProduct(productId);
  }

  async addReview(
    productId: number,
    body: CreateReviewDto,
    user: any
  ): Promise<any> {
    const clientId = await this.userService.getClientId(user.user_id);
    return await this.reviewService.addReview(productId, body, clientId);
  }
}
