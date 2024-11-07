import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Product } from "../products/product.entity";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn({ name: "category_id" })
  category_id!: number;

  @Column({ nullable: false })
  product_id!: number;

  @Column({ nullable: false, type: "varchar", length: 255 })
  name!: string;

  @ManyToOne(() => Product, (product) => product.categories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: Product;
}
