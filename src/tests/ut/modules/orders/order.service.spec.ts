import { Test, TestingModule } from "@nestjs/testing";
import { OrderService } from "../../../../modules/orders/order.service";
import { OrderRepository } from "../../../../modules/orders/order.repository";
import { GuestService } from "../../../../modules/guests/guest.service";
import { ShippingAddressService } from "../../../../modules/shipping-addresses/shipping-address.service";
import { ProductService } from "../../../../modules/products/product.service";
import { OrderProductService } from "../../../../modules/orders-products/order-product.service";
import { CreateGuestOrderDto } from "../../../../modules/orders/DTO/createGuestOrder.dto";
import { Order } from "../../../../modules/orders/order.entity";
import { OrderProduct } from "../../../../modules/orders-products/order-product.entity";
import { EmployeeOrderPreviewDto } from "../../../../modules/orders/DTO/employeeOrderPreview.dto";
import { ShippingAddress } from "../../../../modules/shipping-addresses/shipping-address.entity";
import { OrderStatus } from "../../../../modules/orders/enum/orderStatus";
import { UserService } from "../../../../modules/users/user.service";
import { ClientService } from "../../../../modules/clients/client.service";

describe("OrderService", () => {
  let service: OrderService;
  let orderRepository: OrderRepository;
  let guestService: GuestService;
  let shippingAddressService: ShippingAddressService;
  let productService: ProductService;
  let orderProductService: OrderProductService;
  let userService: UserService;
  let clientService: ClientService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {
            create: jest.fn(),
            getOrder: jest.fn(),
            getGuestId: jest.fn(),
            getAll: jest.fn(),
          },
        },
        {
          provide: GuestService,
          useValue: {
            createGuest: jest.fn(),
            getEmail: jest.fn(),
          },
        },
        {
          provide: ShippingAddressService,
          useValue: {
            createShippingAddress: jest.fn(),
          },
        },
        {
          provide: ProductService,
          useValue: {
            getProducts: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserOrderInfo: jest.fn(),
            getAccountEmail: jest.fn(),
          },
        },
        {
          provide: ClientService,
          useValue: {
            getUserId: jest.fn().mockResolvedValue(1),
            getUserFirstName: jest.fn().mockResolvedValue("Jan"),
          },
        },
        {
          provide: OrderProductService,
          useValue: {
            createOrderProduct: jest.fn(),
            getProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<OrderRepository>(OrderRepository);
    guestService = module.get<GuestService>(GuestService);
    shippingAddressService = module.get<ShippingAddressService>(
      ShippingAddressService
    );
    productService = module.get<ProductService>(ProductService);
    orderProductService = module.get<OrderProductService>(OrderProductService);
    userService = module.get<UserService>(UserService);
    clientService = module.get<ClientService>(ClientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a guest order", async () => {
    const createGuestOrderDto: CreateGuestOrderDto = {
      guestDto: {
        firstName: "Jan",
        lastName: "Kowalski",
        phoneNumber: "123123123",
        email: "test@example.com",
      },
      shippingAddressDto: {
        streetAddress: "ul. 3 Maja",
        city: "Wroclaw",
        postalCode: "52-119",
        houseNumber: "1",
        apartmentNumber: "1",
      },
      orderProductDtos: [{ productId: 1, quantity: 2 }],
    };

    const guest = {
      guest_id: 1,
      first_name: "Jan",
      last_name: "Kowalski",
      phone_number: "123123123",
      email: "test@example.com",
      orders: [],
    };

    const createdOrder = {
      order_id: 1,
      shipping_address_id: 1,
      shippingAddress: {} as ShippingAddress,
      total_amount: 200,
      client_id: null,
      guest_id: 1,
      status: OrderStatus.PENDING,
      order_date: new Date(),
      orderProducts: [],
    };

    const shippingAddress = {
      shipping_address_id: 1,
      order: createdOrder,
      order_id: 1,
      street_address: "ul. 3 Maja",
      city: "Wroclaw",
      postal_code: "52-119",
      house_number: "1",
      apartment_number: "1",
    };
    createdOrder.shippingAddress = shippingAddress;
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
        favouriteProducts: [],
      },
    ];

    jest.spyOn(guestService, "createGuest").mockResolvedValue(guest);
    jest
      .spyOn(shippingAddressService, "createShippingAddress")
      .mockResolvedValue(shippingAddress);
    jest.spyOn(productService, "getProducts").mockResolvedValue(mockProducts);
    jest.spyOn(orderRepository, "create").mockResolvedValue(createdOrder);
    jest
      .spyOn(orderProductService, "createOrderProduct")
      .mockResolvedValue(null);

    const result = await service.createGuestOrder(createGuestOrderDto);

    expect(result).toBe(createdOrder.order_id);
    expect(guestService.createGuest).toHaveBeenCalledWith(
      createGuestOrderDto.guestDto
    );
    expect(shippingAddressService.createShippingAddress).toHaveBeenCalledWith(
      createGuestOrderDto.shippingAddressDto
    );
    expect(productService.getProducts).toHaveBeenCalledWith([1]);
    expect(orderRepository.create).toHaveBeenCalledWith(expect.any(Order));
    expect(orderProductService.createOrderProduct).toHaveBeenCalledWith({
      orderId: createdOrder.order_id,
      productId: 1,
      productPrice: 100,
      quantity: 2,
    });
  });

  it("should return an order", async () => {
    const order = { order_id: 1 } as Order;
    jest.spyOn(orderRepository, "getOrder").mockResolvedValue(order);

    const result = await service.getOrder(1);

    expect(result).toBe(order);
    expect(orderRepository.getOrder).toHaveBeenCalledWith(1);
  });

  it("should return order products", async () => {
    const orderProducts = [{ product_id: 1, order_id: 1 }] as OrderProduct[];
    jest
      .spyOn(orderProductService, "getProducts")
      .mockResolvedValue(orderProducts);

    const result = await service.getProducts(1);

    expect(result).toBe(orderProducts);
    expect(orderProductService.getProducts).toHaveBeenCalledWith(1);
  });

  it("should return guest email", async () => {
    const guestId = 1;
    const email = "test@example.com";
    jest.spyOn(orderRepository, "getGuestId").mockResolvedValue(guestId);
    jest.spyOn(guestService, "getEmail").mockResolvedValue(email);

    const result = await service.getGuestEmail(1);

    expect(result).toBe(email);
    expect(orderRepository.getGuestId).toHaveBeenCalledWith(1);
    expect(guestService.getEmail).toHaveBeenCalledWith(guestId);
  });

  it("should return undefined if guest id is not found", async () => {
    jest.spyOn(orderRepository, "getGuestId").mockResolvedValue(null);

    const result = await service.getGuestEmail(1);

    expect(result).toBeUndefined();
    expect(orderRepository.getGuestId).toHaveBeenCalledWith(1);
  });

  it("should return employee order previews", async () => {
    const orders = [
      {
        order_id: 1,
        guest_id: 1,
        status: "pending",
        total_amount: 200,
        order_date: new Date(),
      },
    ] as Order[];
    const email = "test@example.com";
    jest.spyOn(orderRepository, "getAll").mockResolvedValue(orders);
    jest.spyOn(guestService, "getEmail").mockResolvedValue(email);

    const result = await service.getEmployeePreviews();

    expect(result).toEqual([
      {
        id: 1,
        status: "pending",
        email: email,
        amount: 200,
        date: orders[0].order_date,
      },
    ]);
    expect(orderRepository.getAll).toHaveBeenCalled();
    expect(guestService.getEmail).toHaveBeenCalledWith(1);
  });
});
