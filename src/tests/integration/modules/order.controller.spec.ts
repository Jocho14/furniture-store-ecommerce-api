import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource, QueryRunner } from "typeorm";
import request from "supertest";

import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";

import { OrderService } from "../../../modules/orders/order.service";
import { OrderRepository } from "../../../modules/orders/order.repository";
import { Order } from "../../../modules/orders/order.entity";
import { OrderModule } from "../../../modules/orders/order.module";

import { ProductService } from "../../../modules/products/product.service";
import { ProductRepository } from "../../../modules/products/product.repository";
import { Product } from "../../../modules/products/product.entity";
import { ProductModule } from "../../../modules/products/product.module";

import { CreateGuestDto } from "../../../modules/guests/DTO/createGuest.dto";
import { CreateShippingAddressDto } from "../../../modules/shipping-addresses/DTO/createShippingAddress.dto";
import { OrderProductDto } from "../../../modules/orders-products/DTO/orderProduct.dto";
import { CreateGuestOrderDto } from "../../../modules/orders/DTO/createGuestOrder.dto";

import { ClientRepository } from "../../../modules/clients/client.repository";
import { UserRepository } from "../../../modules/users/user.repository";
import { AccountRepository } from "../../../modules/accounts/account.repository";

import { JwtService } from "@nestjs/jwt";
import { userRole } from "../../../auth/enum/userRole";
import { ThumbnailProductDto } from "../../../modules/products/DTO/thumbnailProduct.dto";
import { CreateClientOrderDto } from "../../../modules/orders/DTO/createClientOrder.dto";
import { AccountCreateDto } from "../../../modules/accounts/DTO/accountCreate.dto";
import { UserCreateDto } from "../../../modules/users/DTO/userCreate.dto";

dotenv.config();

describe("ProductController Integration Test", () => {
  let app: INestApplication;
  let service: OrderService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let orderRepository: OrderRepository;
  let productRepository: ProductRepository;
  let clientRepository: ClientRepository;
  let userRepository: UserRepository;
  let accountRepository: AccountRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        OrderModule,
        TypeOrmModule.forRoot({
          type: "postgres",
          host: process.env.TEST_DB_HOST,
          port: Number(process.env.TEST_DB_PORT),
          username: process.env.TEST_DB_USER,
          password: process.env.TEST_DB_PASSWORD,
          database: process.env.TEST_DB_NAME,
          entities: [__dirname + "/../../../modules/**/*.entity.ts"],
          autoLoadEntities: true,
          synchronize: false,
        }),
        TypeOrmModule.forFeature([Order]),
      ],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    service = module.get<OrderService>(OrderService);
    dataSource = module.get<DataSource>(DataSource);
    orderRepository = module.get<OrderRepository>(OrderRepository);
    productRepository = module.get<ProductRepository>(ProductRepository);
    clientRepository = module.get<ClientRepository>(ClientRepository);
    userRepository = module.get<UserRepository>(UserRepository);
    accountRepository = module.get<AccountRepository>(AccountRepository);
  });

  beforeEach(async () => {
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await queryRunner.query(`
        ALTER SEQUENCE products_product_id_seq RESTART WITH 1;
        `);
    await queryRunner.query(`
            ALTER SEQUENCE orders_order_id_seq RESTART WITH 1;
        `);
    await queryRunner.query(`
          ALTER SEQUENCE accounts_account_id_seq RESTART WITH 1;
      `);
    await queryRunner.query(`
        ALTER SEQUENCE users_user_id_seq RESTART WITH 1;
    `);
    await queryRunner.query(`
      ALTER SEQUENCE clients_client_id_seq RESTART WITH 1;
  `);
    await queryRunner.commitTransaction();
  });

  afterEach(async () => {
    await productRepository.deleteAll();
    await clientRepository.deleteAll();
    await orderRepository.deleteAll();
    await userRepository.deleteAll();
    await accountRepository.deleteAll();
  }, 15000);

  afterAll(async () => {
    await app.close();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it("should create a guest order", async () => {
    const product1 = new Product("test product 1", 100, "description 1");
    const product2 = new Product("test product 2", 50, "description 2");

    const product1Id = await productRepository.add(product1);
    const product2Id = await productRepository.add(product2);

    const createGuestOrderDto = new CreateGuestOrderDto();

    const createGuestDto = new CreateGuestDto();
    createGuestDto.firstName = "Jan";
    createGuestDto.lastName = "Kowalski";
    createGuestDto.email = "g@email.com";
    createGuestDto.phoneNumber = "123456789";

    const createShippingAddressDto = new CreateShippingAddressDto();
    createShippingAddressDto.city = "Wroclaw";
    createShippingAddressDto.streetAddress = "Ul. 3 Maja";
    createShippingAddressDto.postalCode = "00-000";
    createShippingAddressDto.houseNumber = "12";
    createShippingAddressDto.apartmentNumber = "1";

    const orderProductDto1 = new OrderProductDto(product1Id, 2);
    const orderProductDto2 = new OrderProductDto(product2Id, 2);
    const orderProductDtos = [orderProductDto1, orderProductDto2];

    createGuestOrderDto.guestDto = createGuestDto;
    createGuestOrderDto.shippingAddressDto = createShippingAddressDto;
    createGuestOrderDto.orderProductDtos = orderProductDtos;

    await request(app.getHttpServer())
      .post("/Orders/create-guest-order")
      .send(createGuestOrderDto)
      .expect(201);
  });

  it("should create a client order", async () => {
    const product1 = new Product("test product 1", 100, "description 1");
    const product2 = new Product("test product 2", 50, "description 2");

    const product1Id = await productRepository.add(product1);
    const product2Id = await productRepository.add(product2);

    const createClientOrderDto = new CreateClientOrderDto();

    const accountCreateDto = new AccountCreateDto();
    accountCreateDto.email = "example@email.com";
    accountCreateDto.password = "password";

    const userCreateDto = new UserCreateDto();
    userCreateDto.account = accountCreateDto;
    userCreateDto.dateOfBirth = new Date("1990-01-01");
    userCreateDto.firstName = "Jan";
    userCreateDto.lastName = "Kowalski";
    userCreateDto.phoneNumber = "123456789";

    const createShippingAddressDto = new CreateShippingAddressDto();
    createShippingAddressDto.city = "Wroclaw";
    createShippingAddressDto.streetAddress = "Ul. 3 Maja";
    createShippingAddressDto.postalCode = "00-000";
    createShippingAddressDto.houseNumber = "12";
    createShippingAddressDto.apartmentNumber = "1";

    await request(app.getHttpServer())
      .post("/users/create-client")
      .send({ ...userCreateDto })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...accountCreateDto })
      .expect(201);

    const orderProductDto1 = new OrderProductDto(product1Id, 2);
    const orderProductDto2 = new OrderProductDto(product2Id, 2);
    const orderProductDtos = [orderProductDto1, orderProductDto2];

    createClientOrderDto.shippingAddressDto = createShippingAddressDto;
    createClientOrderDto.orderProductDtos = orderProductDtos;

    await request(app.getHttpServer())
      .post("/orders/create-client-order")
      .send(createClientOrderDto)
      .set("Cookie", [`${login.headers["set-cookie"]}`])
      .expect(201);
  });

  it("should return guest e-mail by order ID", async () => {
    const product1 = new Product("test product 1", 100, "description 1");
    const product2 = new Product("test product 2", 50, "description 2");

    const product1Id = await productRepository.add(product1);
    const product2Id = await productRepository.add(product2);

    const createGuestOrderDto = new CreateGuestOrderDto();

    const createGuestDto = new CreateGuestDto();
    createGuestDto.firstName = "Jan";
    createGuestDto.lastName = "Kowalski";
    createGuestDto.email = "g@email.com";
    createGuestDto.phoneNumber = "123456789";

    const createShippingAddressDto = new CreateShippingAddressDto();
    createShippingAddressDto.city = "Wroclaw";
    createShippingAddressDto.streetAddress = "Ul. 3 Maja";
    createShippingAddressDto.postalCode = "00-000";
    createShippingAddressDto.houseNumber = "12";
    createShippingAddressDto.apartmentNumber = "1";

    const orderProductDto1 = new OrderProductDto(product1Id, 2);
    const orderProductDto2 = new OrderProductDto(product2Id, 2);
    const orderProductDtos = [orderProductDto1, orderProductDto2];

    createGuestOrderDto.guestDto = createGuestDto;
    createGuestOrderDto.shippingAddressDto = createShippingAddressDto;
    createGuestOrderDto.orderProductDtos = orderProductDtos;

    await request(app.getHttpServer())
      .post("/orders/create-guest-order")
      .send(createGuestOrderDto)
      .expect(201);

    const email = await request(app.getHttpServer())
      .get(`/orders/1/guest-email`)
      .expect(200);

    expect(email.text).toEqual(createGuestDto.email);
  });

  it("should cancel pending order", async () => {
    const product1 = new Product("test product 1", 100, "description 1");
    const product2 = new Product("test product 2", 50, "description 2");

    const product1Id = await productRepository.add(product1);
    const product2Id = await productRepository.add(product2);

    const createGuestOrderDto = new CreateGuestOrderDto();

    const createGuestDto = new CreateGuestDto();
    createGuestDto.firstName = "Jan";
    createGuestDto.lastName = "Kowalski";
    createGuestDto.email = "g@email.com";
    createGuestDto.phoneNumber = "123456789";

    const createShippingAddressDto = new CreateShippingAddressDto();
    createShippingAddressDto.city = "Wroclaw";
    createShippingAddressDto.streetAddress = "Ul. 3 Maja";
    createShippingAddressDto.postalCode = "00-000";
    createShippingAddressDto.houseNumber = "12";
    createShippingAddressDto.apartmentNumber = "1";

    const orderProductDto1 = new OrderProductDto(product1Id, 2);
    const orderProductDto2 = new OrderProductDto(product2Id, 2);
    const orderProductDtos = [orderProductDto1, orderProductDto2];

    createGuestOrderDto.guestDto = createGuestDto;
    createGuestOrderDto.shippingAddressDto = createShippingAddressDto;
    createGuestOrderDto.orderProductDtos = orderProductDtos;

    const accountCreateDto = new AccountCreateDto();
    accountCreateDto.email = "example@email.com";
    accountCreateDto.password = "password";

    const userCreateDto = new UserCreateDto();
    userCreateDto.account = accountCreateDto;
    userCreateDto.dateOfBirth = new Date("1990-01-01");
    userCreateDto.firstName = "Jan";
    userCreateDto.lastName = "Kowalski";
    userCreateDto.phoneNumber = "123456789";

    await request(app.getHttpServer())
      .post("/users/create-employee")
      .send({ ...userCreateDto, secret: process.env.EMPLOYEE_SECRET })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...accountCreateDto })
      .expect(201);

    await request(app.getHttpServer())
      .post("/orders/create-guest-order")
      .send(createGuestOrderDto)
      .expect(201);

    const manageDetailsBefore = await request(app.getHttpServer())
      .get("/orders/1/manage")
      .set("Cookie", [`${login.headers["set-cookie"]}`])
      .expect(200);

    expect(manageDetailsBefore.body.status).toEqual("pending");

    await request(app.getHttpServer())
      .put("/orders/1/cancel")
      .set("Cookie", [`${login.headers["set-cookie"]}`])
      .expect(200);

    const manageDetailsAfter = await request(app.getHttpServer())
      .get("/orders/1/manage")
      .set("Cookie", [`${login.headers["set-cookie"]}`])
      .expect(200);

    expect(manageDetailsAfter.body.status).toEqual("canceled");
  });

  it("should complete an order", async () => {
    const product1 = new Product("test product 1", 100, "description 1");
    const product2 = new Product("test product 2", 50, "description 2");

    const product1Id = await productRepository.add(product1);
    const product2Id = await productRepository.add(product2);

    const createGuestOrderDto = new CreateGuestOrderDto();

    const createGuestDto = new CreateGuestDto();
    createGuestDto.firstName = "Jan";
    createGuestDto.lastName = "Kowalski";
    createGuestDto.email = "g@email.com";
    createGuestDto.phoneNumber = "123456789";

    const createShippingAddressDto = new CreateShippingAddressDto();
    createShippingAddressDto.city = "Wroclaw";
    createShippingAddressDto.streetAddress = "Ul. 3 Maja";
    createShippingAddressDto.postalCode = "00-000";
    createShippingAddressDto.houseNumber = "12";
    createShippingAddressDto.apartmentNumber = "1";

    const orderProductDto1 = new OrderProductDto(product1Id, 2);
    const orderProductDto2 = new OrderProductDto(product2Id, 2);
    const orderProductDtos = [orderProductDto1, orderProductDto2];

    createGuestOrderDto.guestDto = createGuestDto;
    createGuestOrderDto.shippingAddressDto = createShippingAddressDto;
    createGuestOrderDto.orderProductDtos = orderProductDtos;

    const accountCreateDto = new AccountCreateDto();
    accountCreateDto.email = "example@email.com";
    accountCreateDto.password = "password";

    const userCreateDto = new UserCreateDto();
    userCreateDto.account = accountCreateDto;
    userCreateDto.dateOfBirth = new Date("1990-01-01");
    userCreateDto.firstName = "Jan";
    userCreateDto.lastName = "Kowalski";
    userCreateDto.phoneNumber = "123456789";

    await request(app.getHttpServer())
      .post("/users/create-employee")
      .send({ ...userCreateDto, secret: process.env.EMPLOYEE_SECRET })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...accountCreateDto })
      .expect(201);

    await request(app.getHttpServer())
      .post("/orders/create-guest-order")
      .send(createGuestOrderDto)
      .expect(201);

    const manageDetailsBefore = await request(app.getHttpServer())
      .get("/orders/1/manage")
      .set("Cookie", [`${login.headers["set-cookie"]}`])
      .expect(200);

    expect(manageDetailsBefore.body.status).toEqual("pending");

    await request(app.getHttpServer()).post("/orders/1/complete").expect(201);

    const manageDetailsAfter = await request(app.getHttpServer())
      .get("/orders/1/manage")
      .set("Cookie", [`${login.headers["set-cookie"]}`])
      .expect(200);

    expect(manageDetailsAfter.body.status).toEqual("completed");
  });

  it("should return order details", async () => {
    const product1 = new Product("test product 1", 100, "description 1");
    const product2 = new Product("test product 2", 50, "description 2");

    const product1Id = await productRepository.add(product1);
    const product2Id = await productRepository.add(product2);

    const createGuestOrderDto = new CreateGuestOrderDto();

    const createGuestDto = new CreateGuestDto();
    createGuestDto.firstName = "Jan";
    createGuestDto.lastName = "Kowalski";
    createGuestDto.email = "g@email.com";
    createGuestDto.phoneNumber = "123456789";

    const createShippingAddressDto = new CreateShippingAddressDto();
    createShippingAddressDto.city = "Wroclaw";
    createShippingAddressDto.streetAddress = "Ul. 3 Maja";
    createShippingAddressDto.postalCode = "00-000";
    createShippingAddressDto.houseNumber = "12";
    createShippingAddressDto.apartmentNumber = "1";

    const orderProductDto1 = new OrderProductDto(product1Id, 2);
    const orderProductDto2 = new OrderProductDto(product2Id, 2);
    const orderProductDtos = [orderProductDto1, orderProductDto2];

    createGuestOrderDto.guestDto = createGuestDto;
    createGuestOrderDto.shippingAddressDto = createShippingAddressDto;
    createGuestOrderDto.orderProductDtos = orderProductDtos;

    const accountCreateDto = new AccountCreateDto();
    accountCreateDto.email = "example@email.com";
    accountCreateDto.password = "password";

    const userCreateDto = new UserCreateDto();
    userCreateDto.account = accountCreateDto;
    userCreateDto.dateOfBirth = new Date("1990-01-01");
    userCreateDto.firstName = "Jan";
    userCreateDto.lastName = "Kowalski";
    userCreateDto.phoneNumber = "123456789";

    await request(app.getHttpServer())
      .post("/users/create-employee")
      .send({ ...userCreateDto, secret: process.env.EMPLOYEE_SECRET })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...accountCreateDto })
      .expect(201);

    await request(app.getHttpServer())
      .post("/orders/create-guest-order")
      .send(createGuestOrderDto)
      .expect(201);

    await request(app.getHttpServer())
      .get("/orders/1/manage")
      .set("Cookie", [`${login.headers["set-cookie"]}`])
      .expect(200);
  });

  it("should return client e-mail from an order", async () => {
    const product1 = new Product("test product 1", 100, "description 1");
    const product2 = new Product("test product 2", 50, "description 2");

    const product1Id = await productRepository.add(product1);
    const product2Id = await productRepository.add(product2);

    const createClientOrderDto = new CreateClientOrderDto();

    const accountCreateDto = new AccountCreateDto();
    accountCreateDto.email = "example@email.com";
    accountCreateDto.password = "password";

    const userCreateDto = new UserCreateDto();
    userCreateDto.account = accountCreateDto;
    userCreateDto.dateOfBirth = new Date("1990-01-01");
    userCreateDto.firstName = "Jan";
    userCreateDto.lastName = "Kowalski";
    userCreateDto.phoneNumber = "123456789";

    const createShippingAddressDto = new CreateShippingAddressDto();
    createShippingAddressDto.city = "Wroclaw";
    createShippingAddressDto.streetAddress = "Ul. 3 Maja";
    createShippingAddressDto.postalCode = "00-000";
    createShippingAddressDto.houseNumber = "12";
    createShippingAddressDto.apartmentNumber = "1";

    await request(app.getHttpServer())
      .post("/users/create-client")
      .send({ ...userCreateDto })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...accountCreateDto })
      .expect(201);

    const orderProductDto1 = new OrderProductDto(product1Id, 2);
    const orderProductDto2 = new OrderProductDto(product2Id, 2);
    const orderProductDtos = [orderProductDto1, orderProductDto2];

    createClientOrderDto.shippingAddressDto = createShippingAddressDto;
    createClientOrderDto.orderProductDtos = orderProductDtos;

    await request(app.getHttpServer())
      .post("/orders/create-client-order")
      .send(createClientOrderDto)
      .set("Cookie", [`${login.headers["set-cookie"]}`])
      .expect(201);

    const email = await request(app.getHttpServer())
      .get(`/orders/1/client-email`)
      .expect(200);

    expect(email.text).toEqual(accountCreateDto.email);
  });

  it("should not create client order when unauthorized", async () => {
    const product1 = new Product("test product 1", 100, "description 1");
    const product2 = new Product("test product 2", 50, "description 2");

    const product1Id = await productRepository.add(product1);
    const product2Id = await productRepository.add(product2);

    const createClientOrderDto = new CreateClientOrderDto();

    const accountCreateDto = new AccountCreateDto();
    accountCreateDto.email = "example@email.com";
    accountCreateDto.password = "password";

    const userCreateDto = new UserCreateDto();
    userCreateDto.account = accountCreateDto;
    userCreateDto.dateOfBirth = new Date("1990-01-01");
    userCreateDto.firstName = "Jan";
    userCreateDto.lastName = "Kowalski";
    userCreateDto.phoneNumber = "123456789";

    const createShippingAddressDto = new CreateShippingAddressDto();
    createShippingAddressDto.city = "Wroclaw";
    createShippingAddressDto.streetAddress = "Ul. 3 Maja";
    createShippingAddressDto.postalCode = "00-000";
    createShippingAddressDto.houseNumber = "12";
    createShippingAddressDto.apartmentNumber = "1";

    await request(app.getHttpServer())
      .post("/users/create-client")
      .send({ ...userCreateDto })
      .expect(201);

    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...accountCreateDto })
      .expect(201);

    const orderProductDto1 = new OrderProductDto(product1Id, 2);
    const orderProductDto2 = new OrderProductDto(product2Id, 2);
    const orderProductDtos = [orderProductDto1, orderProductDto2];

    createClientOrderDto.shippingAddressDto = createShippingAddressDto;
    createClientOrderDto.orderProductDtos = orderProductDtos;

    await request(app.getHttpServer())
      .post("/orders/create-client-order")
      .send(createClientOrderDto)
      .set("Cookie", "auth_token=invalid_token")
      .expect(401);
  });

  it("should not cancel an order when not authorized", async () => {
    const product1 = new Product("test product 1", 100, "description 1");
    const product2 = new Product("test product 2", 50, "description 2");

    const product1Id = await productRepository.add(product1);
    const product2Id = await productRepository.add(product2);

    const createGuestOrderDto = new CreateGuestOrderDto();

    const createGuestDto = new CreateGuestDto();
    createGuestDto.firstName = "Jan";
    createGuestDto.lastName = "Kowalski";
    createGuestDto.email = "g@email.com";
    createGuestDto.phoneNumber = "123456789";

    const createShippingAddressDto = new CreateShippingAddressDto();
    createShippingAddressDto.city = "Wroclaw";
    createShippingAddressDto.streetAddress = "Ul. 3 Maja";
    createShippingAddressDto.postalCode = "00-000";
    createShippingAddressDto.houseNumber = "12";
    createShippingAddressDto.apartmentNumber = "1";

    const orderProductDto1 = new OrderProductDto(product1Id, 2);
    const orderProductDto2 = new OrderProductDto(product2Id, 2);
    const orderProductDtos = [orderProductDto1, orderProductDto2];

    createGuestOrderDto.guestDto = createGuestDto;
    createGuestOrderDto.shippingAddressDto = createShippingAddressDto;
    createGuestOrderDto.orderProductDtos = orderProductDtos;

    const accountCreateDto = new AccountCreateDto();
    accountCreateDto.email = "example@email.com";
    accountCreateDto.password = "password";

    const userCreateDto = new UserCreateDto();
    userCreateDto.account = accountCreateDto;
    userCreateDto.dateOfBirth = new Date("1990-01-01");
    userCreateDto.firstName = "Jan";
    userCreateDto.lastName = "Kowalski";
    userCreateDto.phoneNumber = "123456789";

    await request(app.getHttpServer())
      .post("/users/create-employee")
      .send({ ...userCreateDto, secret: process.env.EMPLOYEE_SECRET })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...accountCreateDto })
      .expect(201);

    await request(app.getHttpServer())
      .post("/orders/create-guest-order")
      .send(createGuestOrderDto)
      .expect(201);

    const manageDetailsBefore = await request(app.getHttpServer())
      .get("/orders/1/manage")
      .set("Cookie", [`${login.headers["set-cookie"]}`])
      .expect(200);

    expect(manageDetailsBefore.body.status).toEqual("pending");

    await request(app.getHttpServer())
      .put("/orders/1/cancel")
      .set("Cookie", "auth_token=invalid_token")
      .expect(401);

    const manageDetailsAfter = await request(app.getHttpServer())
      .get("/orders/1/manage")
      .set("Cookie", [`${login.headers["set-cookie"]}`])
      .expect(200);

    expect(manageDetailsAfter.body.status).toEqual("pending");
  });
});
