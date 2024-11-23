import { Injectable } from "@nestjs/common";
import { ProductCategoryRepository } from "./product-category.repository";
import { CategoryService } from "../categories/category.service";

@Injectable()
export class ProductCategoryService {
  constructor(
    private readonly productCategoryRepository: ProductCategoryRepository,
    private readonly categoryService: CategoryService
  ) {}

  async getCategory(productId: number): Promise<string> {
    const categoryId = await this.productCategoryRepository.get(productId);
    if (!categoryId) {
      return "";
    }

    return await this.categoryService.getName(categoryId);
  }

  async saveProductCategory(
    productId: number,
    categoryId: number
  ): Promise<void> {
    return await this.productCategoryRepository.saveProductCategory(
      productId,
      categoryId
    );
  }

  async deleteProductCategory(productId: number): Promise<void> {
    return await this.productCategoryRepository.deleteProductCategory(
      productId
    );
  }
}
