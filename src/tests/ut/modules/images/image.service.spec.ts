import { Test, TestingModule } from "@nestjs/testing";
import { ImageService } from "../../../../modules/images/image.service";
import { ImageRepository } from "../../../../modules/images/image.repository";

import {
  ref,
  listAll,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getStorage,
} from "firebase/storage";
import { ImageDto } from "../../../../modules/images/DTO/image.dto";
import { Image } from "../../../../modules/images/image.entity";
import { Readable } from "stream";

jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  listAll: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
  getStorage: jest.fn(),
}));

describe("ImageService", () => {
  let service: ImageService;
  let repository: ImageRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        {
          provide: ImageRepository,
          useValue: {
            save: jest.fn(),
            deleteAll: jest.fn(),
            getThumbnail: jest.fn(),
            getImages: jest.fn(),
            getImageUrls: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ImageService>(ImageService);
    repository = module.get<ImageRepository>(ImageRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should upload images and return download URLs", async () => {
    const imageDto: ImageDto = {
      productId: 1,
      files: [
        {
          buffer: Buffer.from("file1"),
          mimetype: "image/jpeg",
          filename: "file1.jpg",
          fieldname: "file1",
          originalname: "file1.jpg",
          encoding: "7bit",
          size: Buffer.from("file1").length,
          stream: new Readable(),
          destination: "",
          path: "",
        },
        {
          buffer: Buffer.from("file2"),
          mimetype: "image/jpeg",
          filename: "file2.jpg",
          fieldname: "file2",
          originalname: "file2.jpg",
          encoding: "7bit",
          size: Buffer.from("file2").length,
          stream: new Readable(),
          destination: "",
          path: "",
        },
      ],
    };

    const mockStorageRef = {};
    const mockUploadResult = { ref: {} };
    const mockDownloadUrl = "http://example.com/image.jpg";
    const storage = getStorage();

    (ref as jest.Mock).mockReturnValue(mockStorageRef);
    (uploadBytes as jest.Mock).mockResolvedValue(mockUploadResult);
    (getDownloadURL as jest.Mock).mockResolvedValue(mockDownloadUrl);

    const result = await service.uploadImages(imageDto);

    expect(result).toEqual([mockDownloadUrl, mockDownloadUrl]);
    expect(repository.save).toHaveBeenCalledTimes(2);
  });

  it("should delete all images for a product", async () => {
    const productId = 1;
    const mockStorageRef = {};
    const mockListResult = { items: [{}, {}] };

    (ref as jest.Mock).mockReturnValue(mockStorageRef);
    (listAll as jest.Mock).mockResolvedValue(mockListResult);
    (deleteObject as jest.Mock).mockResolvedValue(undefined);

    await service.deleteAllImages(productId);

    expect(listAll).toHaveBeenCalledWith(mockStorageRef);
    expect(deleteObject).toHaveBeenCalledTimes(2);
    expect(repository.deleteAll).toHaveBeenCalledWith(productId);
  });

  it("should return the number of images for a product", async () => {
    const productId = "1";
    const mockStorageRef = {};
    const mockListResult = { items: [{}, {}] };

    (ref as jest.Mock).mockReturnValue(mockStorageRef);
    (listAll as jest.Mock).mockResolvedValue(mockListResult);

    const result = await service.getAllImageNames(productId);

    expect(result).toBe("Product with id: 1, contains: 2 images");
  });

  it("should return the thumbnail image for a product", async () => {
    const productId = 1;
    const mockImage = new Image(
      productId,
      "http://example.com/image.jpg",
      "image.jpg",
      true
    );

    (repository.getThumbnail as jest.Mock).mockResolvedValue(mockImage);

    const result = await service.getThumbnailForProduct(productId);

    expect(result).toEqual(mockImage);
  });

  it("should return all images for a product", async () => {
    const productId = 1;
    const mockImages = [
      new Image(
        productId,
        "http://example.com/image1.jpg",
        "image1.jpg",
        false
      ),
      new Image(
        productId,
        "http://example.com/image2.jpg",
        "image2.jpg",
        false
      ),
    ];

    (repository.getImages as jest.Mock).mockResolvedValue(mockImages);

    const result = await service.getImagesForProduct(productId);

    expect(result).toEqual(mockImages);
  });

  it("should return all image URLs for a product", async () => {
    const productId = 1;
    const mockImageUrls = [
      "http://example.com/image1.jpg",
      "http://example.com/image2.jpg",
    ];

    (repository.getImageUrls as jest.Mock).mockResolvedValue(mockImageUrls);

    const result = await service.getImageUrlsForProduct(productId);

    expect(result).toEqual(mockImageUrls);
  });

  it("should return sorted masonry images for a category", async () => {
    const categoryId = 1;
    const mockStorageRef = {};
    const mockListResult = { items: [{ name: "image1" }, { name: "image2" }] };
    const mockDownloadUrl = "http://example.com/image.jpg";

    (ref as jest.Mock).mockReturnValue(mockStorageRef);
    (listAll as jest.Mock).mockResolvedValue(mockListResult);
    (getDownloadURL as jest.Mock).mockResolvedValue(mockDownloadUrl);

    const result = await service.getMasonryImages(categoryId);

    expect(result).toEqual([mockDownloadUrl, mockDownloadUrl]);
  });
});
