import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "../users/user.entity";
import { Review } from "../reviews/review.entity";
import { Order } from "../orders/order.entity";
import { ClientFavouriteProduct } from "../clients-favourites-products/client-favourite-product.entity";

@Entity("clients")
export class Client {
  constructor(userId: number) {
    this.user_id = userId;
  }
  @PrimaryGeneratedColumn()
  client_id!: number;

  @Column({ nullable: false })
  user_id!: number;

  @OneToOne(() => User, (user) => user.client)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => Review, (review) => review.client, { cascade: true })
  reviews!: Review[];

  @OneToMany(() => Order, (order) => order.client, { cascade: true })
  orders!: Order[];

  @OneToMany(
    () => ClientFavouriteProduct,
    (favouriteProduct) => favouriteProduct.client
  )
  favouriteProducts!: ClientFavouriteProduct[];
}
