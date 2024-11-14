import { Body, Controller, Post } from "@nestjs/common";

import { OrderService } from "./order.service";

import { CreateGuestOrderDto } from "./DTO/createGuestOrder.dto";

@Controller("Orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post("create-guest-order")
  async createGuestOrder(@Body() createGuestOrderDto: CreateGuestOrderDto) {
    console.log("createGuestOrderDto", createGuestOrderDto);
    return await this.orderService.createGuestOrder(createGuestOrderDto);
  }
}
