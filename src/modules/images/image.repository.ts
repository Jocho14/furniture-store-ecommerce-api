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
    try {
      await this.repository.save(image);
      return "uploaded!";
    } catch (error) {
      console.error("Error saving image:", error);
      return "error";
    }
  }
}
