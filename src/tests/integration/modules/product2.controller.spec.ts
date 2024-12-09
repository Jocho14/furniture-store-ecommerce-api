import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource, QueryRunner } from "typeorm";
import request from "supertest";

import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";

import { ProductService } from "../../../modules/products/product.service";
import { ProductController } from "../../../modules/products/product.controller";
import { ProductRepository } from "../../../modules/products/product.repository";
import { Product } from "../../../modules/products/product.entity";
import { ProductModule } from "../../../modules/products/product.module";

import { listProudctDto } from "../../../modules/products/DTO/listProduct.dto";
import { ExtendedPreviewProductDto } from "../../../modules/products/DTO/extendedPreviewProduct.dto";
import { PreviewProductDto } from "../../../modules/products/DTO/previewProduct.dto";
import { DetailProductClientDto } from "../../../modules/products/DTO/detailProductClient.dto";

import { UserRepository } from "../../../modules/users/user.repository";
import { AccountRepository } from "../../../modules/accounts/account.repository";
import { ReviewRepository } from "../../../modules/reviews/review.repository";

import { JwtService } from "@nestjs/jwt";
import { userRole } from "../../../auth/enum/userRole";
import { ThumbnailProductDto } from "../../../modules/products/DTO/thumbnailProduct.dto";
import { AccountCreateDto } from "../../../modules/accounts/DTO/accountCreate.dto";
import { UserCreateDto } from "../../../modules/users/DTO/userCreate.dto";
import { CreateReviewDto } from "../../../modules/reviews/DTO/createReview.dto";
import { SearchProductDto } from "../../../modules/products/DTO/searchProduct.dto";

dotenv.config();

describe("ProductController Integration Test", () => {
  let app: INestApplication;
  let service: ProductService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let productRepository: ProductRepository;
  let userRepository: UserRepository;
  let accountRepository: AccountRepository;
  let reviewRepository: ReviewRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProductModule,
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
        TypeOrmModule.forFeature([Product]),
      ],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    service = module.get<ProductService>(ProductService);
    dataSource = module.get<DataSource>(DataSource);
    productRepository = module.get<ProductRepository>(ProductRepository);
    userRepository = module.get<UserRepository>(UserRepository);
    accountRepository = module.get<AccountRepository>(AccountRepository);
    reviewRepository = module.get<ReviewRepository>(ReviewRepository);
  });

  beforeEach(async () => {
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await queryRunner.query(`
      ALTER SEQUENCE products_product_id_seq RESTART WITH 1;
    `);
    await queryRunner.query(`
      ALTER SEQUENCE accounts_account_id_seq RESTART WITH 1;
    `);
    await queryRunner.query(`
      ALTER SEQUENCE users_user_id_seq RESTART WITH 1;
    `);
    await queryRunner.query(`
      ALTER SEQUENCE reviews_review_id_seq RESTART WITH 1;
    `);
    await queryRunner.commitTransaction();
  });

  afterEach(async () => {
    await productRepository.deleteAll();
    await accountRepository.deleteAll();
    await userRepository.deleteAll();
    await reviewRepository.deleteAll();
  });

  afterAll(async () => {
    await app.close();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it("should deactivate product", async () => {
    const product1 = new Product("test product 1", 100, "description 1");
    const product1Id = await productRepository.add(product1);

    const activeCheckBefore = await request(app.getHttpServer())
      .get(`/products/${product1Id}/check-active`)
      .expect(200);

    expect(activeCheckBefore.body).toEqual({ isActive: true });

    const response = await request(app.getHttpServer())
      .put(`/products/${product1Id}/deactivate`)
      .expect(200);

    const activeCheckAfter = await request(app.getHttpServer())
      .get(`/products/${product1Id}/check-active`)
      .expect(200);

    expect(activeCheckAfter.body).toEqual({ isActive: false });
  });

  it("should add review", async () => {
    const product1 = new Product("test product 1", 100, "description 1");
    await productRepository.add(product1);

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
      .post("/users/create-client")
      .send({ ...userCreateDto })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...accountCreateDto })
      .expect(201);

    const createReviewDto = new CreateReviewDto(4, "good product");

    await request(app.getHttpServer())
      .post("/products/1/add-review")
      .set("Cookie", [`${login.headers["set-cookie"]}`])
      .send({ ...createReviewDto })
      .expect(201);
  });

  it("should return all reviews for a product", async () => {
    const product1 = new Product("test product 1", 100, "description 1");
    const product1Id = await productRepository.add(product1);

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
      .post("/users/create-client")
      .send({ ...userCreateDto })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...accountCreateDto })
      .expect(201);

    const createReviewDto = new CreateReviewDto(4, "good product");

    await request(app.getHttpServer())
      .post("/products/1/add-review")
      .set("Cookie", [`${login.headers["set-cookie"]}`])
      .send({ ...createReviewDto })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get(`/products/${product1Id}/reviews`)
      .expect(200);

    expect(response.body).toEqual([
      { ...response.body[0], rating: 4, comment: "good product" },
    ]);
  });

  it("should return prices for products", async () => {
    const product1 = new Product("test product 1", 100, "description 1");
    const product2 = new Product("test product 2", 50, "description 2");

    const product1Id = await productRepository.add(product1);
    const product2Id = await productRepository.add(product2);

    const response = await request(app.getHttpServer())
      .get("/products/prices")
      .query({ ids: [product1Id, product2Id] })
      .expect(200);

    expect(response.body).toEqual([
      { id: product1Id, price: product1.price.toString() + ".00" },
      { id: product2Id, price: product2.price.toString() + ".00" },
    ]);
  });

  it("should return searched products", async () => {
    const product1 = new Product("test product 1", 100, "description 1");
    const product2 = new Product("test product 2", 50, "description 2");

    const product1Id = await productRepository.add(product1);
    const product2Id = await productRepository.add(product2);

    const searchProductDto1 = new SearchProductDto();
    searchProductDto1.productId = product1Id;
    searchProductDto1.name = "test product 1";
    searchProductDto1.thumbnailUrl = "null";
    searchProductDto1.category = "";

    const searchProductDto2 = new SearchProductDto();
    searchProductDto2.productId = product2Id;
    searchProductDto2.name = "test product 2";
    searchProductDto2.thumbnailUrl = "null";
    searchProductDto2.category = "";

    const response = await request(app.getHttpServer())
      .get("/products/search")
      .query({ query: "test" })
      .expect(200);

    expect(response.body).toEqual([
      { ...searchProductDto1 },
      { ...searchProductDto2 },
    ]);
  });

  it("should return product details for client", async () => {});

  it("test 1", async () => {});
});
