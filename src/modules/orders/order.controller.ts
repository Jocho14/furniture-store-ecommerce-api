import { Body, Controller, Post, Get, Param } from "@nestjs/common";

import { OrderService } from "./order.service";

import { CreateGuestOrderDto } from "./DTO/createGuestOrder.dto";
import { LineItemDto } from "./DTO/lineItem.dto";

@Controller("Orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post("create-guest-order")
  async createGuestOrder(@Body() createGuestOrderDto: CreateGuestOrderDto) {
    console.log("createGuestOrderDto", createGuestOrderDto);
    return await this.orderService.createGuestOrder(createGuestOrderDto);
  }

  @Get(":id")
  async getOrder(@Param("id") id: number) {
    return await this.orderService.getOrder(id);
  }

  @Get(":id/products")
  async getProducts(@Param("id") id: number) {
    return await this.orderService.getProducts(id);
  }

  @Get(":id/guest-email")
  async getGuestEmail(@Param("id") id: number) {
    return await this.orderService.getGuestEmail(id);
  }
}
