import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";

import { Product } from "../products/product.entity";
import { Category } from "../categories/category.entity";

@Entity("products_categories")
export class ProductCategory {
  @PrimaryColumn()
  product_id!: number;

  @PrimaryColumn()
  category_id!: number;

  @ManyToOne(() => Product, (product) => product.productWarehouses)
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @ManyToOne(() => Category, (category) => category.productCategories)
  @JoinColumn({ name: "category_id" })
  category!: Category;
}
