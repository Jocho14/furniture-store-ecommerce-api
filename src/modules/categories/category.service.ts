import { Injectable } from "@nestjs/common";

import { CategoryRepository } from "./category.repository";

import { ImageService } from "../images/image.service";
import { MasonryDto } from "./DTO/masonry.dto";

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly imageService: ImageService
  ) {}

  async getMasonry(id: number): Promise<MasonryDto> {
    const imageUrls = await this.imageService.getMasonryImages(id);
    const categoryName = await this.categoryRepository.getCategoryName(id);

    const masonry = new MasonryDto(categoryName, imageUrls);

    return masonry;
  }
}
