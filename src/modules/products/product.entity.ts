import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  product_id!: number;

  @Column()
  name!: string;

  @Column()
  price!: number;

  @Column()
  description!: string;
}
