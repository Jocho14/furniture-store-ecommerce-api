import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";

import { Product } from "../products/product.entity";
import { Order } from "../orders/order.entity";

@Entity("orders_products")
export class OrderProduct {
  constructor(
    order_id: number,
    product_id: number,
    product_price: number,
    quantity: number
  ) {
    this.order_id = order_id;
    this.product_id = product_id;
    this.product_price = product_price;
    this.quantity = quantity;
  }

  @PrimaryColumn()
  order_id!: number;

  @PrimaryColumn()
  product_id!: number;

  @Column("int", { nullable: false })
  quantity!: number;

  @Column("numeric", { nullable: false, precision: 10, scale: 2 })
  product_price!: number;

  @ManyToOne(() => Order, (order) => order.orderProducts)
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @ManyToOne(() => Product, (product) => product.orderProducts)
  @JoinColumn({ name: "product_id" })
  product!: Product;
}
