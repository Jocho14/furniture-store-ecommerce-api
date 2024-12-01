import { Test, TestingModule } from "@nestjs/testing";
import { CategoryService } from "../../../../modules/categories/category.service";
import { CategoryRepository } from "../../../../modules/categories/category.repository";
import { ImageService } from "../../../../modules/images/image.service";
import { MasonryDto } from "../../../../modules/categories/DTO/masonry.dto";

describe("CategoryService", () => {
  let service: CategoryService;
  let categoryRepository: CategoryRepository;
  let imageService: ImageService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: {
            getCategoryName: jest.fn(),
          },
        },
        {
          provide: ImageService,
          useValue: {
            getMasonryImages: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
    imageService = module.get<ImageService>(ImageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return a MasonryDto", async () => {
    const id = 1;
    const imageUrls = ["image1.jpg", "image2.jpg"];
    const categoryName = "Living Room";

    jest.spyOn(imageService, "getMasonryImages").mockResolvedValue(imageUrls);
    jest
      .spyOn(categoryRepository, "getCategoryName")
      .mockResolvedValue(categoryName);

    const result = await service.getMasonry(id);

    expect(imageService.getMasonryImages).toHaveBeenCalledWith(id);
    expect(categoryRepository.getCategoryName).toHaveBeenCalledWith(id);
    expect(result).toEqual(new MasonryDto(categoryName, imageUrls));
  });
});
