import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from "typeorm";

import { Product } from "../products/product.entity";
import { ProductCategory } from "../products-categories/product-category.entity";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn({ name: "category_id" })
  category_id!: number;

  @Column({ nullable: false, type: "varchar", length: 255 })
  name!: string;

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.category
  )
  productCategories!: ProductCategory[];
}
