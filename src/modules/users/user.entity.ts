import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Account } from "../accounts/account.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column({ nullable: false })
  firstName!: string;

  @Column({ nullable: false })
  lastName!: string;

  @Column({ nullable: false })
  phoneNumber!: string;

  @Column({ nullable: false })
  dateOfBirth!: Date;

  @OneToOne(() => Account, (account) => account.user, { cascade: true })
  @JoinColumn()
  account!: Account;
}
