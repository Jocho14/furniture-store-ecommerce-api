import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Order } from "./order.entity";

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>
  ) {}

  async getOrder(orderId: number): Promise<Order | null> {
    return await this.repository.findOne({
      where: {
        order_id: orderId,
      },
    });
  }

  async create(order: Order): Promise<Order> {
    return await this.repository.save(order);
  }

  async getGuestId(orderId: number): Promise<number | null> {
    const order = await this.repository.findOne({
      where: {
        order_id: orderId,
      },
    });
    return order ? order.guest_id : null;
  }

  async getAll(): Promise<Order[]> {
    return await this.repository.find();
  }
}
