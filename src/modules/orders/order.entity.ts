import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";

import { Client } from "../clients/client.entity";
import { Guest } from "../guests/guest.entity";
import { ShippingAddress } from "../shipping-addresses/shipping-address.entity";
import { OrderStatus } from "./enum/orderStatus";
import { OrderProduct } from "../orders-products/order-product.entity";

@Entity("orders")
export class Order {
  constructor(
    shipping_address_id: number,
    total_amount: number,
    client_id: number | null = null,
    guest_id: number | null = null
  ) {
    this.shipping_address_id = shipping_address_id;
    this.total_amount = total_amount;
    this.client_id = client_id;
    this.guest_id = guest_id;
  }

  @PrimaryGeneratedColumn()
  order_id!: number;

  @Column({ nullable: true })
  client_id!: number | null;

  @Column({ nullable: true })
  guest_id!: number | null;

  @Column({ nullable: false })
  shipping_address_id!: number;

  @Column({ nullable: false, type: "int" })
  total_amount!: number;

  @Column({
    nullable: false,
    type: "date",
    default: () => "CURRENT_DATE",
  })
  order_date!: Date;

  @Column({
    nullable: false,
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @ManyToOne(() => Client, (client) => client.orders, { nullable: true })
  @JoinColumn({ name: "client_id" })
  client?: Client | null;

  @ManyToOne(() => Guest, (guest) => guest.orders, { nullable: true })
  @JoinColumn({ name: "guest_id" })
  guest?: Guest | null;

  @OneToOne(() => ShippingAddress, (shippingAddress) => shippingAddress.order)
  @JoinColumn({ name: "shipping_address_id" })
  shippingAddress!: ShippingAddress;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProducts!: OrderProduct[];
}
