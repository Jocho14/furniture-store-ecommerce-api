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

import { ProductWarehouseRepository } from "../../../modules/products-warehouses/product-warehouse.repository";
import { ProductWarehouse } from "../../../modules/products-warehouses/product-warehouse.entity";
import { ProductWarehouseModule } from "../../../modules/products-warehouses/product-warehouse.module";
import { ProductWarehouseService } from "../../../modules/products-warehouses/product-warehouse.service";

import { JwtService } from "@nestjs/jwt";
import { userRole } from "../../../auth/enum/userRole";
import { ThumbnailProductDto } from "../../../modules/products/DTO/thumbnailProduct.dto";
import { DetailProductEmployeeDto } from "../../../modules/products/DTO/detailProductEmployee.dto";

dotenv.config();

describe("ProductController Integration Test", () => {
  let app: INestApplication;
  let service: ProductService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let productRepository: ProductRepository;
  let productWarehouseRepository: ProductWarehouseRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProductModule,
        ProductWarehouseModule,
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
        TypeOrmModule.forFeature([ProductWarehouse]),
      ],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    service = module.get<ProductService>(ProductService);
    dataSource = module.get<DataSource>(DataSource);
    productRepository = module.get<ProductRepository>(ProductRepository);
    productWarehouseRepository = module.get<ProductWarehouseRepository>(
      ProductWarehouseRepository
    );
  });

  beforeEach(async () => {
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await queryRunner.query(`
      ALTER SEQUENCE products_product_id_seq RESTART WITH 1;
    `);
    await queryRunner.commitTransaction();
  });

  afterEach(async () => {
    await productWarehouseRepository.deleteAll();
    await productRepository.deleteAll();
  });

  afterAll(async () => {
    await app.close();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it("should return products quantities", async () => {
    const product1 = new Product("test product 1", 100, "description 1");
    const product2 = new Product("test product 2", 50, "description 2");

    const product1Id = await productRepository.add(product1);
    const product2Id = await productRepository.add(product2);

    const response = await request(app.getHttpServer())
      .post(`/products-warehouses/quantities`)
      .send({ ids: [product1Id, product2Id] })
      .expect(201);

    expect(response.body).toEqual([]);
  });
});
