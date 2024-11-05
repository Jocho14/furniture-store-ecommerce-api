import { Repository, In } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductWarehouse } from "./product-warehouse.entity";

@Injectable()
export class ProductWarehouseRepository {
  constructor(
    @InjectRepository(ProductWarehouse)
    private readonly repository: Repository<ProductWarehouse>
  ) {}

  // NOTE: For now the warehouseId is always equal to 1
  async getQuantity(productId: number): Promise<number | null> {
    const productWarehouse = await this.repository.findOne({
      where: { product_id: productId, warehouse_id: 1 },
    });

    return productWarehouse ? productWarehouse.quantity : null;
  }

  async getQuantities(productId: number[]): Promise<ProductWarehouse[] | null> {
    const productWarehouse = await this.repository.find({
      where: { product_id: In(productId), warehouse_id: 1 },
    });

    return productWarehouse;
  }

  async setQuantity(
    productId: number,
    quantity: number
  ): Promise<number | null> {
    const productWarehouse = new ProductWarehouse(productId, 1, quantity);
    await this.repository.save(productWarehouse);
    return quantity;
  }

  async updateQuantity(
    productId: number,
    quantity: number
  ): Promise<number | null> {
    await this.repository.update(
      { product_id: productId, warehouse_id: 1 },
      { quantity }
    );
    return quantity;
  }
}
