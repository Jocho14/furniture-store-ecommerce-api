import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ProductWarehouse } from "../products-warehouses/product-warehouse.entity";

@Entity("warehouses")
export class Warehouse {
  @PrimaryGeneratedColumn()
  warehouse_id!: number;

  @Column()
  name!: string;

  @Column()
  location!: string;

  @OneToMany(
    () => ProductWarehouse,
    (productWarehouse) => productWarehouse.warehouse
  )
  productWarehouses!: ProductWarehouse[];
}
