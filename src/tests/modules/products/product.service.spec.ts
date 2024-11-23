import { Test, TestingModule } from "@nestjs/testing";
import { ProductService } from "../../../modules/products/product.service";
import { ProductRepository } from "../../../modules/products/product.repository";
import { ImageService } from "../../../modules/images/image.service";
import { ProductWarehouseService } from "../../../modules/products-warehouses/product-warehouse.service";
import { ReviewService } from "../../../modules/reviews/review.service";
import { UserService } from "../../../modules/users/user.service";
import { AuthenticatedUser } from "../../../auth/interface/IAuth";
import { ProductCategoryService } from "../../../modules/products-categories/product-category.service";

describe("ProductService", () => {
  let productService: ProductService;
  let productRepository: ProductRepository;
  let imageService: ImageService;
  let productWarehouseService: ProductWarehouseService;
  let reviewService: ReviewService;
  let userService: UserService;
  let productCategoryService: ProductCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: {
            getAll: jest.fn(),
            getById: jest.fn(),
            getByIds: jest.fn(),
            add: jest.fn(),
            update: jest.fn(),
            deactivate: jest.fn(),
            search: jest.fn(),
          },
        },
        {
          provide: ImageService,
          useValue: {
            getThumbnailForProduct: jest.fn(),
            getImagesForProduct: jest.fn(),
            uploadImages: jest.fn(),
            deleteAllImages: jest.fn(),
            getImageUrlsForProduct: jest.fn(),
          },
        },
        {
          provide: ProductCategoryService,
          useValue: {
            getCategory: jest.fn(),
          },
        },
        {
          provide: ProductWarehouseService,
          useValue: {
            getQuantity: jest.fn(),
            setQuantity: jest.fn(),
            updateQuantity: jest.fn(),
          },
        },
        {
          provide: ReviewService,
          useValue: {
            getReviewsForProduct: jest.fn(),
            addReview: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getClientId: jest.fn(),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
    imageService = module.get<ImageService>(ImageService);
    productWarehouseService = module.get<ProductWarehouseService>(
      ProductWarehouseService
    );
    reviewService = module.get<ReviewService>(ReviewService);
    userService = module.get<UserService>(UserService);
    productCategoryService = module.get<ProductCategoryService>(
      ProductCategoryService
    );
  });

  it("should be defined", () => {
    expect(productService).toBeDefined();
  });

  it("should return an array of products with thumbnails", async () => {
    const mockProducts = [
      {
        product_id: 1,
        name: "Product 1",
        price: 100,
        description: "Description",
        is_active: true,
        images: [],
        reviews: [],
        productWarehouses: [],
        orderProducts: [],
        productCategories: [],
      },
    ];

    const mockThumbnail = {
      image_id: 1,
      product_id: 1,
      is_thumbnail: true,
      url: "thumbnail.jpg",
      alt: "thumbnail",
      product: mockProducts[0],
    };
    const mockQuantity = 10;

    jest.spyOn(productRepository, "getAll").mockResolvedValue(mockProducts);
    jest
      .spyOn(imageService, "getThumbnailForProduct")
      .mockResolvedValue(mockThumbnail);
    jest
      .spyOn(productWarehouseService, "getQuantity")
      .mockResolvedValue(mockQuantity);

    const result = await productService.getAllWithThumbnails();
    expect(result).toEqual([
      {
        id: 1,
        name: "Product 1",
        price: 100,
        thumbnail: "thumbnail.jpg",
        alt: "thumbnail",
        quantity: 10,
      },
    ]);
  });

  it("should return product details by id", async () => {
    const mockProduct = {
      product_id: 1,
      name: "Product 1",
      price: 100,
      description: "Description",
      is_active: true,
      images: [],
      reviews: [],
      productWarehouses: [],
      orderProducts: [],
      productCategories: [],
    };

    const mockImages = [
      {
        image_id: 1,
        product_id: 1,
        is_thumbnail: true,
        url: "thumbnail.jpg",
        alt: "thumbnail",
        product: mockProduct,
      },
      {
        image_id: 2,
        product_id: 1,
        is_thumbnail: false,
        url: "image.jpg",
        alt: "image",
        product: mockProduct,
      },
    ];

    jest.spyOn(productRepository, "getById").mockResolvedValue(mockProduct);
    jest
      .spyOn(imageService, "getImagesForProduct")
      .mockResolvedValue(mockImages);

    const result = await productService.getById(1);
    expect(result).toEqual({
      name: "Product 1",
      price: 100,
      description: "Description",
      imageUrls: ["thumbnail.jpg", "image.jpg"],
    });
  });

  it("should return extended previews of products", async () => {
    const mockProducts = [
      {
        product_id: 1,
        name: "Product 1",
        price: 100,
        description: "Description",
        is_active: true,
        images: [],
        reviews: [],
        productWarehouses: [],
        orderProducts: [],
        productCategories: [],
      },
    ];
    const mockThumbnail = {
      image_id: 1,
      product_id: 1,
      is_thumbnail: true,
      url: "thumbnail.jpg",
      alt: "thumbnail",
      product: mockProducts[0],
    };
    const mockQuantity = 10;

    jest.spyOn(productRepository, "getByIds").mockResolvedValue(mockProducts);
    jest
      .spyOn(imageService, "getThumbnailForProduct")
      .mockResolvedValue(mockThumbnail);
    jest
      .spyOn(productWarehouseService, "getQuantity")
      .mockResolvedValue(mockQuantity);

    const result = await productService.getExtendedPreviews([1]);
    expect(result).toEqual([
      {
        productId: 1,
        name: "Product 1",
        price: 100,
        thumbnailUrl: "thumbnail.jpg",
        quantity: 10,
      },
    ]);
  });

  it("should return previews of products", async () => {
    const mockProducts = [
      {
        product_id: 1,
        name: "Product 1",
        price: 100,
        description: "Description",
        is_active: true,
        images: [],
        reviews: [],
        productWarehouses: [],
        orderProducts: [],
        productCategories: [],
      },
    ];
    const mockThumbnail = {
      image_id: 1,
      product_id: 1,
      is_thumbnail: true,
      url: "thumbnail.jpg",
      alt: "thumbnail",
      product: mockProducts[0],
    };

    jest.spyOn(productRepository, "getByIds").mockResolvedValue(mockProducts);
    jest
      .spyOn(imageService, "getThumbnailForProduct")
      .mockResolvedValue(mockThumbnail);

    const result = await productService.getPreviews([1]);
    expect(result).toEqual([
      {
        productId: 1,
        name: "Product 1",
        price: 100,
        thumbnailUrl: "thumbnail.jpg",
      },
    ]);
  });

  it("should upload files and return their URLs", async () => {
    const mockFiles = [{ originalname: "file1.jpg" }] as Express.Multer.File[];
    const mockImageUrls = ["url1.jpg"];

    jest.spyOn(imageService, "uploadImages").mockResolvedValue(mockImageUrls);

    const result = await productService.uploadFiles(1, mockFiles);
    expect(result).toEqual(mockImageUrls);
  });

  it("should add a new product and return its details", async () => {
    const mockProductDto = {
      name: "Product 1",
      price: 100,
      description: "Description",
      quantity: 10,
      images: [{ originalname: "file1.jpg" }] as Express.Multer.File[],
      category: "",
    };
    const mockProductId = 1;
    const mockImageUrls = ["url1.jpg"];

    jest.spyOn(productRepository, "add").mockResolvedValue(mockProductId);
    jest
      .spyOn(productWarehouseService, "setQuantity")
      .mockResolvedValue(undefined);
    jest.spyOn(imageService, "uploadImages").mockResolvedValue(mockImageUrls);

    const result = await productService.add(mockProductDto);
    expect(result).toEqual({
      name: "Product 1",
      price: 100,
      thumbnailUrl: "url1.jpg",
    });
  });

  it("should return payment details of products", async () => {
    const mockProducts = [
      {
        product_id: 1,
        name: "Product 1",
        price: 100,
        description: "Description",
        is_active: true,
        images: [],
        reviews: [],
        productWarehouses: [],
        orderProducts: [],
        productCategories: [],
      },
    ];
    const mockImageUrls = ["url1.jpg"];

    jest.spyOn(productRepository, "getByIds").mockResolvedValue(mockProducts);
    jest
      .spyOn(imageService, "getImageUrlsForProduct")
      .mockResolvedValue(mockImageUrls);

    const result = await productService.getPaymentDetails([1]);
    expect(result).toEqual([
      {
        productId: 1,
        name: "Product 1",
        price: 100,
        imageUrls: ["url1.jpg"],
      },
    ]);
  });

  it("should return managed details of a product", async () => {
    const mockProduct = {
      product_id: 1,
      name: "Product 1",
      price: 100,
      description: "Description",
      is_active: true,
      images: [],
      reviews: [],
      productWarehouses: [],
      orderProducts: [],
      productCategories: [],
    };
    const mockImageUrls = ["url1.jpg"];
    const mockQuantity = 10;

    jest.spyOn(productRepository, "getById").mockResolvedValue(mockProduct);
    jest
      .spyOn(imageService, "getImageUrlsForProduct")
      .mockResolvedValue(mockImageUrls);
    jest
      .spyOn(productWarehouseService, "getQuantity")
      .mockResolvedValue(mockQuantity);

    const result = await productService.getManagedDetails(1);
    expect(result).toEqual({
      name: "Product 1",
      price: 100,
      description: "Description",
      quantity: 10,
      images: ["url1.jpg"],
    });
  });

  it("should update a product and return its details", async () => {
    const mockProductDto = {
      name: "Product 1",
      price: 100,
      description: "Description",
      quantity: 10,
      images: [{ originalname: "file1.jpg" }] as Express.Multer.File[],
      category: "",
    };
    const mockImageUrls = ["url1.jpg"];

    jest.spyOn(imageService, "deleteAllImages").mockResolvedValue(undefined);
    jest.spyOn(imageService, "uploadImages").mockResolvedValue(mockImageUrls);
    jest
      .spyOn(productWarehouseService, "updateQuantity")
      .mockResolvedValue(undefined);
    jest.spyOn(productRepository, "update").mockResolvedValue(undefined);

    const result = await productService.update(1, mockProductDto);
    expect(result).toEqual({
      name: "Product 1",
      price: 100,
      thumbnailUrl: "url1.jpg",
    });
  });

  it("should deactivate a product and return its details", async () => {
    const mockProduct = {
      product_id: 1,
      name: "Product 1",
      price: 100,
      description: "Description",
      is_active: true,
      images: [],
      reviews: [],
      productWarehouses: [],
      orderProducts: [],
      productCategories: [],
    };
    const mockThumbnail = {
      image_id: 1,
      product_id: 1,
      is_thumbnail: true,
      url: "thumbnail.jpg",
      alt: "thumbnail",
      product: mockProduct,
    };

    jest
      .spyOn(productWarehouseService, "updateQuantity")
      .mockResolvedValue(undefined);
    jest.spyOn(productRepository, "deactivate").mockResolvedValue(undefined);
    jest.spyOn(productRepository, "getById").mockResolvedValue(mockProduct);
    jest
      .spyOn(imageService, "getThumbnailForProduct")
      .mockResolvedValue(mockThumbnail);

    const result = await productService.deactivate(1);
    expect(result).toEqual({
      name: "Product 1",
      price: 100,
      thumbnailUrl: "thumbnail.jpg",
    });
  });

  it("should return reviews of a product", async () => {
    const mockReviews = [
      {
        reviewId: 1,
        reviewerName: "Jan",
        rating: 5.0,
        reviewDate: new Date(),
        comment: "Great product!",
      },
    ];

    jest
      .spyOn(reviewService, "getReviewsForProduct")
      .mockResolvedValue(mockReviews);

    const result = await productService.getReviews(1);
    expect(result).toEqual(mockReviews);
  });

  it("should add a review to a product", async () => {
    const mockReviewDto = {
      reviewId: 1,
      reviewerName: "Jan",
      rating: 5.0,
      reviewDate: new Date(),
      comment: "Great product!",
    };

    const mockUser = { user_id: 1 };
    const mockClientId = 1;
    const mockRequest = { user: mockUser } as AuthenticatedUser;

    jest.spyOn(userService, "getClientId").mockResolvedValue(mockClientId);
    jest.spyOn(reviewService, "addReview").mockResolvedValue(mockReviewDto);

    const result = await productService.addReview(
      1,
      mockReviewDto,
      mockRequest
    );
    expect(result).toEqual(mockReviewDto);
  });

  it("should return products by ids", async () => {
    const mockProducts = [
      {
        product_id: 1,
        name: "Product 1",
        price: 100,
        description: "Description",
        is_active: true,
        images: [],
        reviews: [],
        productWarehouses: [],
        orderProducts: [],
        productCategories: [],
      },
    ];

    jest.spyOn(productRepository, "getByIds").mockResolvedValue(mockProducts);

    const result = await productService.getProducts([1]);
    expect(result).toEqual(mockProducts);
  });

  it("should return prices of products by ids", async () => {
    const mockProducts = [
      {
        product_id: 1,
        name: "Product 1",
        price: 100,
        description: "Description",
        is_active: true,
        images: [],
        reviews: [],
        productWarehouses: [],
        orderProducts: [],
        productCategories: [],
      },
    ];

    jest.spyOn(productRepository, "getByIds").mockResolvedValue(mockProducts);

    const result = await productService.getPrices([1]);
    expect(result).toEqual([{ id: 1, price: 100 }]);
  });

  it("should search products by query", async () => {
    const mockProducts = [
      {
        product_id: 1,
        name: "Product 1",
        price: 100,
        description: "Description",
        is_active: true,
        images: [],
        reviews: [],
        productWarehouses: [],
        orderProducts: [],
        productCategories: [],
      },
    ];
    const mockThumbnail = {
      image_id: 1,
      product_id: 1,
      is_thumbnail: true,
      url: "thumbnail.jpg",
      alt: "thumbnail",
      product: mockProducts[0],
    };

    jest.spyOn(productRepository, "search").mockResolvedValue(mockProducts);
    jest
      .spyOn(imageService, "getThumbnailForProduct")
      .mockResolvedValue(mockThumbnail);

    const result = await productService.searchProducts("Product");
    expect(result).toEqual([
      {
        productId: 1,
        name: "Product 1",
        category: "",
        thumbnailUrl: "thumbnail.jpg",
      },
    ]);
  });

  it("should return a list of products", async () => {
    const mockProducts = [
      {
        product_id: 1,
        name: "Product 1",
        price: 100,
        description: "Description",
        is_active: true,
        images: [],
        reviews: [],
        productWarehouses: [],
        orderProducts: [],
        productCategories: [],
      },
    ];
    const mockThumbnail = {
      image_id: 1,
      product_id: 1,
      is_thumbnail: true,
      url: "thumbnail.jpg",
      alt: "thumbnail",
      product: mockProducts[0],
    };

    jest.spyOn(productRepository, "getAll").mockResolvedValue(mockProducts);
    jest
      .spyOn(imageService, "getThumbnailForProduct")
      .mockResolvedValue(mockThumbnail);

    const result = await productService.getList();
    expect(result).toEqual([
      {
        productId: 1,
        name: "Product 1",
        price: 100,
        thumbnailUrl: "thumbnail.jpg",
        category: "",
        averageRating: 0,
      },
    ]);
  });
});
