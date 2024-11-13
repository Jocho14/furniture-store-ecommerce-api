import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";

import { Order } from "../orders/order.entity";

@Entity("shipping_addresses")
export class ShippingAddress {
  constructor(
    street_address: string,
    house_number: string,
    city: string,
    postal_code: string,
    apartment_number?: string
  ) {
    this.street_address = street_address;
    this.house_number = house_number;
    this.apartment_number = apartment_number ? apartment_number : "";
    this.city = city;
    this.postal_code = postal_code;
  }
  @PrimaryGeneratedColumn()
  shipping_address_id!: number;

  @Column({ nullable: false, type: "varchar", length: 120 })
  street_address!: string;

  @Column({ nullable: false, type: "varchar", length: 10 })
  house_number!: string;

  @Column({ type: "varchar", length: 10 })
  apartment_number!: string;

  @Column({ nullable: false, type: "varchar", length: 120 })
  city!: string;

  @Column({ nullable: false, type: "varchar", length: 20 })
  postal_code!: string;

  @OneToOne(() => Order, (order) => order.shippingAddress, {
    cascade: true,
  })
  order!: Order;
}
