import { Test, TestingModule } from "@nestjs/testing";
import { OrderProductService } from "../../../../modules/orders-products/order-product.service";
import { OrderProductRepository } from "../../../../modules/orders-products/order-product.repository";
import { CreateOrderProductDto } from "../../../../modules/orders-products/DTO/createOrderProduct.dto";
import { OrderProduct } from "../../../../modules/orders-products/order-product.entity";

describe("OrderProductService", () => {
  let service: OrderProductService;
  let repository: OrderProductRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderProductService,
        {
          provide: OrderProductRepository,
          useValue: {
            create: jest.fn(),
            getProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderProductService>(OrderProductService);
    repository = module.get<OrderProductRepository>(OrderProductRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return null if productPrice is undefined", async () => {
    const createOrderProductDto: CreateOrderProductDto = {
      orderId: 1,
      productId: 1,
      productPrice: undefined,
      quantity: 1,
    };

    const result = await service.createOrderProduct(createOrderProductDto);
    expect(result).toBeNull();
  });

  it("should call repository.create with correct parameters", async () => {
    const createOrderProductDto: CreateOrderProductDto = {
      orderId: 1,
      productId: 1,
      productPrice: 100,
      quantity: 1,
    };

    const orderProduct = new OrderProduct(
      createOrderProductDto.orderId,
      createOrderProductDto.productId,
      createOrderProductDto.productPrice as number,
      createOrderProductDto.quantity
    );

    await service.createOrderProduct(createOrderProductDto);
    expect(repository.create).toHaveBeenCalledWith(orderProduct);
  });

  it("should call repository.getProducts with correct orderId", async () => {
    const orderId = 1;
    await service.getProducts(orderId);
    expect(repository.getProducts).toHaveBeenCalledWith(orderId);
  });

  it("should return an array of OrderProduct", async () => {
    const orderId = 1;
    const orderProducts: OrderProduct[] = [
      new OrderProduct(1, 1, 100, 1),
      new OrderProduct(1, 2, 200, 2),
    ];

    jest.spyOn(repository, "getProducts").mockResolvedValue(orderProducts);

    const result = await service.getProducts(orderId);
    expect(result).toEqual(orderProducts);
  });
});
