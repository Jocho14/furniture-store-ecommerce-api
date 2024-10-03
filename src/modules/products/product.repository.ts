import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Product } from "./product.entity";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>
  ) {}

  async findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  async getById(id: number): Promise<Product | null> {
    return this.repository.findOne({ where: { product_id: id } });
  }

  async uploadFile(
    id: number,
    fileBuffer: Buffer,
    fileName: string
  ): Promise<void> {}
}
