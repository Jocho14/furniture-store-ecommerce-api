import { Controller, Get, Post, Body } from "@nestjs/common";

import { OrderProductService } from "./order-product.service";

@Controller("Order-Products")
export class OrderProductController {
  constructor(private readonly orderProductService: OrderProductService) {}
}
