import { Controller, Get, Post, Body } from "@nestjs/common";

import { ProductCategoryService } from "./product-category.service";

@Controller("Products-Categories")
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService
  ) {}
}
