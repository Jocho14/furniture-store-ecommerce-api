import { Repository, In } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Category } from "./category.entity";

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>
  ) {}

  async getCategoryName(id: number): Promise<string> {
    const category = await this.repository.findOne({
      where: { category_id: id },
    });
    return category ? category.name : "";
  }

  async getCategoryId(name: string): Promise<number> {
    const category = await this.repository.findOne({
      where: { name },
    });
    return category ? category.category_id : -1;
  }
}
