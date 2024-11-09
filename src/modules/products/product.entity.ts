import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Image } from "../images/image.entity";
import { Category } from "../categories/category.entity";
import { Review } from "../reviews/review.entity";
import { ProductWarehouse } from "../products-warehouses/product-warehouse.entity";

@Entity("products")
export class Product {
  constructor(name: string, price: number, description: string) {
    this.name = name;
    this.price = price;
    this.description = description;
  }

  @PrimaryGeneratedColumn()
  product_id!: number;

  @Column({ nullable: false, type: "varchar", length: 255 })
  name!: string;

  @Column("numeric", { nullable: false, precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "boolean", default: true })
  is_active!: boolean;

  @OneToMany(() => Image, (image) => image.product, { cascade: true })
  images!: Image[];

  @OneToMany(() => Category, (category) => category.product, { cascade: true })
  categories!: Category[];

  @OneToMany(() => Review, (review) => review.product, { cascade: true })
  reviews!: Review[];

  @OneToMany(
    () => ProductWarehouse,
    (productWarehouse) => productWarehouse.product
  )
  productWarehouses!: ProductWarehouse[];
}
