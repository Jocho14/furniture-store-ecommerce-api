import { Repository, In } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderProduct } from "./order-product.entity";

@Injectable()
export class OrderProductRepository {
  constructor(
    @InjectRepository(OrderProduct)
    private readonly repository: Repository<OrderProduct>
  ) {}

  async create(orderProduct: OrderProduct): Promise<OrderProduct> {
    return await this.repository.save(orderProduct);
  }

  async getProducts(orderId: number): Promise<OrderProduct[]> {
    return await this.repository.find({
      where: {
        order_id: orderId,
      },
    });
  }
}
