import { Repository, In } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike } from "typeorm";
import { Product } from "./product.entity";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>
  ) {}

  async getAll(): Promise<Product[]> {
    return await this.repository.find({
      where: { is_active: true },
    });
  }

  async getByIds(ids: number[]): Promise<Product[] | null> {
    return await this.repository.find({
      where: { product_id: In(ids) },
    });
  }

  async getById(id: number): Promise<Product | null> {
    return await this.repository.findOne({ where: { product_id: id } });
  }

  async add(product: Product): Promise<number> {
    const savedProduct = await this.repository.save(product);
    return savedProduct.product_id;
  }

  async update(product: Product): Promise<void> {
    await this.repository.update(product.product_id, {
      name: product.name,
      price: product.price,
      description: product.description,
    });
  }

  async deactivate(id: number): Promise<void> {
    await this.repository.update(id, { is_active: false });
  }

  async search(query: string): Promise<Product[]> {
    return await this.repository.find({
      where: { name: ILike(`%${query}%`) },
      take: 20,
    });
  }
}
