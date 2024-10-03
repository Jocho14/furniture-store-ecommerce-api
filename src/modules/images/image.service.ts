import { Injectable } from "@nestjs/common";
import { ref, listAll, uploadBytes, getDownloadURL } from "firebase/storage";

import { firestoreConfig, firestoreDb, storage } from "../../firebase";

import { ImageRepository } from "./image.repository";
import { Image } from "./image.entity";

@Injectable()
export class ImageService {
  constructor(private readonly imageRepository: ImageRepository) {}

  async uploadImage(
    productId: number,
    file: Express.Multer.File
  ): Promise<string | undefined> {
    const storageRef = ref(
      storage,
      firestoreConfig.storagePaths.productImage(productId, "1_1")
    );

    const blob = new Blob([file.buffer], { type: file.mimetype });

    const uploadResult = await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(uploadResult.ref);

    const image = new Image(productId, downloadUrl);

    return this.imageRepository.save(image);
  }

  async getAllImageNames(productId: string): Promise<string> {
    const storageRef = ref(storage, `images/products/${productId}`);
    const images = await listAll(storageRef);

    return `Product with id: ${productId}, contains: ${images.items.length} images`;
  }
}
