import { Body, Controller, Post } from "@nestjs/common";

import { OrderService } from "./order.service";

import { CreateGuestOrderDto } from "./DTO/createGuestOrder.dto";

@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post("create-guest-order")
  async createGuestOrder(@Body() createGuestOrderDto: CreateGuestOrderDto) {
    return await this.orderService.createGuestOrder(createGuestOrderDto);
  }
}
