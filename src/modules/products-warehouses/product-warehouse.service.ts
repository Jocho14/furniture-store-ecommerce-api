import { Injectable } from "@nestjs/common";
import { ProductWarehouseRepository } from "./product-warehouse.repository";
import { BaseProductWarehouseDto } from "./DTO/baseProductWarehouse.dto";

@Injectable()
export class ProductWarehouseService {
  constructor(
    private readonly productWarehouseRepository: ProductWarehouseRepository
  ) {}

  async getQuantity(productId: number): Promise<number> {
    const quantity = await this.productWarehouseRepository.getQuantity(
      productId
    );
    return quantity || 0;
  }

  async getQuantities(
    productIds: number[]
  ): Promise<BaseProductWarehouseDto[] | undefined> {
    const productWarehouses =
      await this.productWarehouseRepository.getQuantities(productIds);

    return productWarehouses?.map((pw) => ({
      productId: pw.product_id,
      quantity: pw.quantity,
    }));
  }

  async setQuantity(productId: number, quantity: number): Promise<void> {
    if (quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }
    await this.productWarehouseRepository.setQuantity(productId, quantity);
  }

  async updateQuantity(productId: number, quantity: number): Promise<void> {
    if (quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }
    await this.productWarehouseRepository.updateQuantity(productId, quantity);
  }

  async increaseQuantity(productId: number, quantity: number): Promise<void> {
    const currentQuantity = await this.getQuantity(productId);
    await this.setQuantity(productId, currentQuantity + quantity);
  }

  async decreaseQuantity(productId: number, quantity: number): Promise<void> {
    const currentQuantity = await this.getQuantity(productId);
    await this.setQuantity(productId, currentQuantity - quantity);
  }
}
