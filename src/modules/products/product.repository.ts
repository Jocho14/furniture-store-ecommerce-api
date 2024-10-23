import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BasicProductDto } from "./DTO/basicProduct.dto";
import { Product } from "./product.entity";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>
  ) {}

  async getAll(): Promise<Product[]> {
    return await this.repository.find();
  }

  async getById(id: number): Promise<Product | null> {
    return await this.repository.findOne({ where: { product_id: id } });
  }

  async addProduct(product: Product): Promise<number> {
    const savedProduct = await this.repository.save(product);
    return savedProduct.product_id;
  }
}
