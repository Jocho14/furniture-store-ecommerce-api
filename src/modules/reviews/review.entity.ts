import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Product } from "../products/product.entity";
import { Client } from "../clients/client.entity";

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn({ name: "review_id" })
  review_id!: number;

  @Column({ nullable: false })
  client_id!: number;

  @Column({ nullable: false })
  product_id!: number;

  @Column({ nullable: false, type: "int" })
  rating!: number;

  @Column({ nullable: true, type: "text" })
  comment!: string;

  @Column({
    nullable: false,
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  review_date!: Date;

  @ManyToOne(() => Client, (client) => client.reviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "client_id" })
  client!: Client;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: Product;
}
