import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Image } from "../images/image.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  product_id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column("numeric", { precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "text" })
  description!: string;

  @OneToMany(() => Image, (image) => image.product, { cascade: true })
  images!: Image[];
}
