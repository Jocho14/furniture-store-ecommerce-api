import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from "@nestjs/common";

import { MasonryDto } from "./DTO/masonry.dto";

import { CategoryService } from "./category.service";
import { HorizontalTilesDto } from "./DTO/horizontalTiles.dto";

@Controller("Categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(":id/masonry")
  async getMasonry(@Param("id") id: number): Promise<MasonryDto> {
    return await this.categoryService.getMasonry(id);
  }

  @Get(":id/horizontal-tiles")
  async getHorizontalTiles(
    @Param("id") id: number
  ): Promise<HorizontalTilesDto[]> {
    return await this.categoryService.getHorizontalTiles(id);
  }

  // @Get(":id/horizontal-tiles")
  // async getHorizontalTiles(@Param("id") id: number) {
  //   return await this.categoryService.getHorizontalTiles(id);
  // }
}
