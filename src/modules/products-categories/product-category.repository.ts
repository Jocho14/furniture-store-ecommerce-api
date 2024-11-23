import { Repository, In } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductCategory } from "./product-category.entity";

@Injectable()
export class ProductCategoryRepository {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly repository: Repository<ProductCategory>
  ) {}

  async get(productId: number): Promise<number | null> {
    const productCategory = await this.repository.findOne({
      where: { product_id: productId },
    });

    return productCategory?.category_id ? productCategory.category_id : null;
  }

  async saveProductCategory(
    productId: number,
    categoryId: number
  ): Promise<void> {
    await this.repository.save({
      product_id: productId,
      category_id: categoryId,
    });
  }

  async deleteProductCategory(productId: number): Promise<void> {
    await this.repository.delete({ product_id: productId });
  }
}
