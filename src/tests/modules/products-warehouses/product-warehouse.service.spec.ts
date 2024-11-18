import { Test, TestingModule } from "@nestjs/testing";
import { ProductWarehouseService } from "../../../modules/products-warehouses/product-warehouse.service";
import { ProductWarehouseRepository } from "../../../modules/products-warehouses/product-warehouse.repository";
import { ProductWarehouse } from "../../../modules/products-warehouses/product-warehouse.entity";

describe("ProductWarehouseService", () => {
  let service: ProductWarehouseService;
  let repository: ProductWarehouseRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductWarehouseService,
        {
          provide: ProductWarehouseRepository,
          useValue: {
            getQuantity: jest.fn(),
            getQuantities: jest.fn(),
            setQuantity: jest.fn(),
            updateQuantity: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductWarehouseService>(ProductWarehouseService);
    repository = module.get<ProductWarehouseRepository>(
      ProductWarehouseRepository
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return the quantity of a product", async () => {
    const productId = 1;
    const quantity = 10;
    jest.spyOn(repository, "getQuantity").mockResolvedValue(quantity);

    const result = await service.getQuantity(productId);
    expect(result).toBe(quantity);
  });

  it("should return 0 if no quantity is found", async () => {
    const productId = 1;
    jest.spyOn(repository, "getQuantity").mockResolvedValue(null);

    const result = await service.getQuantity(productId);
    expect(result).toBe(0);
  });

  it("should return quantities for multiple products", async () => {
    const productIds = [1, 2];
    const productWarehouses = [
      { product_id: 1, quantity: 10 },
      { product_id: 2, quantity: 20 },
    ] as ProductWarehouse[];
    jest
      .spyOn(repository, "getQuantities")
      .mockResolvedValue(productWarehouses);

    const result = await service.getQuantities(productIds);
    expect(result).toEqual([
      { productId: 1, quantity: 10 },
      { productId: 2, quantity: 20 },
    ]);
  });

  it("should return undefined if no quantities are found", async () => {
    const productIds = [1, 2];
    jest.spyOn(repository, "getQuantities").mockResolvedValue(null);

    const result = await service.getQuantities(productIds);
    expect(result).toBeUndefined();
  });

  it("should set the quantity of a product", async () => {
    const productId = 1;
    const quantity = 10;
    jest.spyOn(repository, "setQuantity").mockResolvedValue(null);

    await service.setQuantity(productId, quantity);
    expect(repository.setQuantity).toHaveBeenCalledWith(productId, quantity);
  });

  it("should throw an error if quantity is negative", async () => {
    const productId = 1;
    const quantity = -10;

    await expect(service.setQuantity(productId, quantity)).rejects.toThrow(
      "Quantity cannot be negative"
    );
  });

  it("should update the quantity of a product", async () => {
    const productId = 1;
    const quantity = 10;
    jest.spyOn(repository, "updateQuantity").mockResolvedValue(null);

    await service.updateQuantity(productId, quantity);
    expect(repository.updateQuantity).toHaveBeenCalledWith(productId, quantity);
  });

  it("should throw an error if quantity is negative", async () => {
    const productId = 1;
    const quantity = -10;

    await expect(service.updateQuantity(productId, quantity)).rejects.toThrow(
      "Quantity cannot be negative"
    );
  });

  it("should increase the quantity of a product", async () => {
    const productId = 1;
    const quantity = 10;
    jest.spyOn(service, "getQuantity").mockResolvedValue(5);
    jest.spyOn(service, "setQuantity").mockResolvedValue(undefined);

    await service.increaseQuantity(productId, quantity);
    expect(service.setQuantity).toHaveBeenCalledWith(productId, 15);
  });

  it("should decrease the quantity of a product", async () => {
    const productId = 1;
    const quantity = 5;
    jest.spyOn(service, "getQuantity").mockResolvedValue(10);
    jest.spyOn(service, "setQuantity").mockResolvedValue(undefined);

    await service.decreaseQuantity(productId, quantity);
    expect(service.setQuantity).toHaveBeenCalledWith(productId, 5);
  });
});
