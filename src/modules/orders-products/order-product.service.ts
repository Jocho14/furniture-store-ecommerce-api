import { Injectable } from "@nestjs/common";
import { OrderProductRepository } from "./order-product.repository";
import { CreateOrderProductDto } from "./DTO/createOrderProduct.dto";
import { OrderProduct } from "./order-product.entity";

@Injectable()
export class OrderProductService {
  constructor(
    private readonly orderProductRepository: OrderProductRepository
  ) {}

  async createOrderProduct(createOrderProductDto: CreateOrderProductDto) {
    if (createOrderProductDto.productPrice == undefined) {
      return null;
    }
    const orderProduct = new OrderProduct(
      createOrderProductDto.orderId,
      createOrderProductDto.productId,
      createOrderProductDto.productPrice,
      createOrderProductDto.quantity
    );

    return this.orderProductRepository.create(orderProduct);
  }
}
