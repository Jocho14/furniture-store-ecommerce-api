import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity("employees")
export class Employee {
  constructor(userId: number) {
    this.user_id = userId;
  }
  @PrimaryGeneratedColumn()
  employee_id!: number;

  @Column({ nullable: false })
  user_id!: number;

  @OneToOne(() => User, (user) => user.employee)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
