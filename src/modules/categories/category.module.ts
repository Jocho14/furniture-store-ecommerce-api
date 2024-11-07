import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

import { ImageModule } from "../images/image.module";

import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { CategoryRepository } from "./category.repository";
import { Category } from "./category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Category]), ImageModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
