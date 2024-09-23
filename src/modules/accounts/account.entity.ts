import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity("accounts")
export class Account {
  @PrimaryGeneratedColumn()
  accountId!: number;

  @Column({ nullable: false })
  userId!: number;

  @Column({ nullable: false })
  username!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ nullable: false })
  email!: string;

  @OneToOne(() => User, (user) => user.account)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
