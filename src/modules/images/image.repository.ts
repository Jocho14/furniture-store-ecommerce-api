import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Image } from "./image.entity";

@Injectable()
export class ImageRepository {
  constructor(
    @InjectRepository(Image)
    private readonly repository: Repository<Image>
  ) {}

  async save(image: Image): Promise<string | undefined> {
    await this.repository.save(image);
    return "Image saved!";
  }

  async getThumbnail(productId: number): Promise<Image | null> {
    return await this.repository.findOne({
      where: { product: { product_id: productId }, is_thumbnail: true },
    });
  }
}
