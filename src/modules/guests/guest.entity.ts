import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { Order } from "../orders/order.entity";

@Entity("guests")
export class Guest {
  constructor(
    first_name: string,
    last_name: string,
    phone_number: string,
    email: string
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone_number = phone_number;
    this.email = email;
  }
  @PrimaryGeneratedColumn()
  guest_id!: number;

  @Column({ nullable: false, type: "varchar", length: 50 })
  first_name!: string;

  @Column({ nullable: false, type: "varchar", length: 50 })
  last_name!: string;

  @Column({ nullable: false, type: "varchar", length: 15 })
  phone_number!: string;

  @Column({ nullable: false, type: "varchar", length: 255 })
  email!: string;

  @OneToMany(() => Order, (order) => order.guest, { cascade: true })
  orders!: Order[];
}
