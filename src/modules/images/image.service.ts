import { Injectable } from "@nestjs/common";
import {
  ref,
  listAll,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { firestoreConfig, firestoreDb, storage } from "../../firebase";

import { ImageRepository } from "./image.repository";
import { ImageDto } from "./DTO/image.dto";
import { Image } from "./image.entity";

import { HorizontalTilesDto } from "../categories/DTO/horizontalTiles.dto";

@Injectable()
export class ImageService {
  constructor(private readonly imageRepository: ImageRepository) {}

  async uploadImages(imageDto: ImageDto): Promise<string[] | undefined> {
    const downloadUrls: string[] = [];
    for (const [index, file] of imageDto.files.entries()) {
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

      downloadUrls.push(downloadUrl);
    }

    return downloadUrls;
  }

  async uploadTestImages(imageDto: ImageDto): Promise<string[] | undefined> {
    const downloadUrls: string[] = [];
    for (const [index, file] of imageDto.files.entries()) {
      const storageRef = ref(
        storage,
        firestoreConfig.storagePaths.testProductImage(
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
      downloadUrls.push(downloadUrl);
    }

    return downloadUrls;
  }

  async deleteAllImages(productId: number): Promise<void> {
    const storageRef = ref(
      storage,
      firestoreConfig.storagePaths.allProductsImages(productId.toString())
    );

    const listResult = await listAll(storageRef);

    const deletePromises = listResult.items.map((itemRef) =>
      deleteObject(itemRef)
    );
    await Promise.all(deletePromises);

    await this.imageRepository.deleteAll(productId);
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

  async getImageUrlsForProduct(productId: number): Promise<string[]> {
    return await this.imageRepository.getImageUrls(productId);
  }

  async urlToFile(
    url: string,
    filename: string,
    mimeType: string
  ): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }

  async getImageFilesForProduct(productId: number): Promise<File[]> {
    const imageUrls = await this.getImageUrlsForProduct(productId);
    const filePromises = imageUrls.map(async (url, index) => {
      const filename = `image_${index}`;
      const mimeType = "image/webp";
      return await this.urlToFile(url, filename, mimeType);
    });
    return await Promise.all(filePromises);
  }

  async getMasonryImages(categoryId: number): Promise<string[]> {
    const storageRef = ref(storage, `images/categories/${categoryId}`);
    const listResult = await listAll(storageRef);
    const sortedItems = listResult.items.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const downloadUrls = await Promise.all(
      sortedItems.map(async (itemRef) => {
        const downloadUrl = await getDownloadURL(itemRef);
        return downloadUrl;
      })
    );

    return downloadUrls;
  }

  async getHorizontalTiles(tilesId: number): Promise<HorizontalTilesDto[]> {
    const storageRef = ref(storage, `images/horizontal-tiles/${tilesId}`);
    const listResult = await listAll(storageRef);

    const tiles = await Promise.all(
      listResult.items.map(async (itemRef) => {
        const downloadUrl = await getDownloadURL(itemRef);
        return {
          name: itemRef.name.split(".")[0],
          imageUrl: downloadUrl,
        };
      })
    );

    return tiles;
  }
}
