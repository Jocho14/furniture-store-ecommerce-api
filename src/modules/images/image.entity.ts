import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product } from "../products/product.entity";

@Entity("images")
export class Image {
  constructor(
    product_id: number,
    url: string,
    alt?: string,
    is_thumbnail?: boolean
  ) {
    this.product_id = product_id;
    this.url = url;
    this.alt = alt || "image_alt";
    if (is_thumbnail) this.is_thumbnail = is_thumbnail;
  }

  @PrimaryGeneratedColumn({ name: "image_id" })
  image_id!: number;

  @Column({ nullable: false })
  product_id!: number;

  @Column({ nullable: false, type: "varchar", length: 255 })
  url!: string;

  @Column({ nullable: false, type: "varchar", length: 255 })
  alt!: string;

  @Column({ nullable: false })
  is_thumbnail!: boolean;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: Product;
}
