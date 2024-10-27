import { Controller, Get, Post, Body } from "@nestjs/common";

import { ProductWarehouseService } from "./product-warehouse.service";
import { BaseProductWarehouseDto } from "./DTO/baseProductWarehouse.dto";

@Controller("Products-Warehouses")
export class ProductWarehouseController {
  constructor(
    private readonly productWarehouseService: ProductWarehouseService
  ) {}

  @Post("quantities")
  async getQuantities(
    @Body("ids") ids: number[]
  ): Promise<BaseProductWarehouseDto[] | undefined> {
    return await this.productWarehouseService.getQuantities(ids);
  }
}
