import { Injectable } from "@nestjs/common";
import { ref, listAll, uploadBytes, getDownloadURL } from "firebase/storage";

import { firestoreConfig, firestoreDb, storage } from "../../firebase";

import { ImageRepository } from "./image.repository";
import { ImageDto } from "./DTO/image.dto";
import { Image } from "./image.entity";

@Injectable()
export class ImageService {
  constructor(private readonly imageRepository: ImageRepository) {}

  async uploadImages(imageDto: ImageDto): Promise<string[] | undefined> {
    const downloadUrls: string[] = await Promise.all(
      imageDto.files.map(async (file, index) => {
        const storageRef = ref(
          storage,
          firestoreConfig.storagePaths.productImage(
            imageDto.productId,
            `${imageDto.productId.toString()}_${index}`
          )
        );

        const blob = new Blob([file.buffer], { type: file.mimetype });
        const uploadResult = await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(uploadResult.ref);

        const image = new Image(
          imageDto.productId,
          downloadUrl,
          file.filename,
          index === 0
        );

        await this.imageRepository.save(image);

        return downloadUrl;
      })
    );

    return downloadUrls;
  }

  async getAllImageNames(productId: string): Promise<string> {
    const storageRef = ref(storage, `images/products/${productId}`);
    const images = await listAll(storageRef);

    return `Product with id: ${productId}, contains: ${images.items.length} images`;
  }

  async getThumbnailForProduct(productId: number): Promise<Image | null> {
    return await this.imageRepository.getThumbnail(productId);
  }

  async getImagesForProduct(productId: number): Promise<Image[]> {
    return await this.imageRepository.getImages(productId);
  }
}
