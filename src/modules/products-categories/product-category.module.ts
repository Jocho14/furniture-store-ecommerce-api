import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductCategory } from "./product-category.entity";
import { ProductCategoryService } from "./product-category.service";
import { ProductCategoryRepository } from "./product-category.repository";
import { ProductCategoryController } from "./product-category.controller";
import { CategoryModule } from "../categories/category.module";

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory]), CategoryModule],
  providers: [ProductCategoryService, ProductCategoryRepository],
  controllers: [ProductCategoryController],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
