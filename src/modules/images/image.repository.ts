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

  async getImages(productId: number): Promise<Image[]> {
    return await this.repository.find({
      where: { product: { product_id: productId } },
    });
  }

  async getImageUrls(productId: number): Promise<string[]> {
    const images = await this.repository.find({
      where: { product: { product_id: productId } },
    });

    return images.map((image) => image.url);
  }
}
