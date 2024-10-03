import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ImageRepository } from "./image.repository";
import { ImageService } from "./image.service";
import { Image } from "./image.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [ImageService, ImageRepository],
  exports: [ImageService],
})
export class ImageModule {}
