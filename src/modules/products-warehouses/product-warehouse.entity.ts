import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";

import { Product } from "../products/product.entity";
import { Warehouse } from "../warehouses/warehouse.entity";

@Entity("products_warehouses")
export class ProductWarehouse {
  constructor(product_id: number, warehouse_id: number, quantity: number) {
    this.product_id = product_id;
    this.warehouse_id = warehouse_id;
    this.quantity = quantity;
  }

  @PrimaryColumn()
  product_id!: number;

  @PrimaryColumn()
  warehouse_id!: number;

  @Column("int")
  quantity!: number;

  @Column("timestamptz")
  last_updated!: number;

  @ManyToOne(() => Product, (product) => product.productWarehouses)
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.productWarehouses)
  @JoinColumn({ name: "warehouse_id" })
  warehouse!: Warehouse;
}
