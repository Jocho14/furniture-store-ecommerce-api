import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Timestamp,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity("accounts")
export class Account {
  @PrimaryGeneratedColumn()
  account_id!: number;

  @Column({ nullable: false })
  user_id!: number;

  @Column({ nullable: false })
  email!: string;

  @Column({ nullable: false })
  password_hash!: string;

  @Column({ nullable: false })
  created_at!: Date;

  @Column({ nullable: false })
  active!: boolean;

  @OneToOne(() => User, (user) => user.account)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
