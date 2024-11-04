import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Account } from "../accounts/account.entity";
import { Client } from "../clients/client.entity";

@Entity("users")
export class User {
  constructor(
    first_name: string,
    last_name: string,
    phone_number: string,
    date_of_birth: Date
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone_number = phone_number;
    this.date_of_birth = date_of_birth;
  }

  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column({ nullable: false, type: "varchar", length: 50 })
  first_name!: string;

  @Column({ nullable: false, type: "varchar", length: 50 })
  last_name!: string;

  @Column({ nullable: false, type: "varchar", length: 15 })
  phone_number!: string;

  @Column({ nullable: false, type: "date" })
  date_of_birth!: Date;

  @OneToOne(() => Account, (account) => account.user, { cascade: true })
  account!: Account;

  @OneToOne(() => Client, (client) => client.user, { cascade: true })
  client!: Client;
}
