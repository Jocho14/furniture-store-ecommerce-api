import { Body, Controller, Post, Get, Param, Req } from "@nestjs/common";

import { OrderService } from "./order.service";

import { UseGuards } from "@nestjs/common";
import { EmployeeGuard } from "../../auth/guards/employee.guard";
import { CreateGuestOrderDto } from "./DTO/createGuestOrder.dto";
import { EmployeeOrderPreviewDto } from "./DTO/employeeOrderPreview.dto";
import { EmployeeOrderManageDto } from "./DTO/employeeOrderManage.dto";
import { ClientGuard } from "../../auth/guards/client.guard";
import { AuthenticatedUser } from "../../auth/interface/IAuth";
import { CreateClientOrderDto } from "./DTO/createClientOrder.dto";

@Controller("Orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("employee-previews")
  @UseGuards(EmployeeGuard)
  async getEmployeePreviews(): Promise<EmployeeOrderPreviewDto[]> {
    return await this.orderService.getEmployeePreviews();
  }

  @Post("create-guest-order")
  async createGuestOrder(@Body() createGuestOrderDto: CreateGuestOrderDto) {
    return await this.orderService.createGuestOrder(createGuestOrderDto);
  }

  @Post("create-client-order")
  @UseGuards(ClientGuard)
  async createClientOrder(
    @Req() req: AuthenticatedUser,
    @Body() createClientOrderDto: CreateClientOrderDto
  ) {
    return await this.orderService.createClientOrder(req, createClientOrderDto);
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

  @Get(":id/client-email")
  async getClientEmail(@Param("id") id: number) {
    return await this.orderService.getClientEmail(id);
  }

  @Get(":id/manage")
  @UseGuards(EmployeeGuard)
  async getManageOrder(
    @Param("id") id: number
  ): Promise<EmployeeOrderManageDto | null> {
    return await this.orderService.getManageOrder(id);
  }
}
