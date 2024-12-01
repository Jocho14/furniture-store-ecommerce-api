import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import request from 'supertest';

import cookieParser from "cookie-parser";
import * as dotenv from 'dotenv';

import { ProductService } from '../../../modules/products/product.service';
import { ProductController } from '../../../modules/products/product.controller';
import { ProductRepository } from '../../../modules/products/product.repository';
import { Product } from '../../../modules/products/product.entity';
import { ProductModule } from '../../../modules/products/product.module';

import { listProudctDto } from '../../../modules/products/DTO/listProduct.dto';
import { ExtendedPreviewProductDto } from '../../../modules/products/DTO/extendedPreviewProduct.dto';

import { JwtService } from '@nestjs/jwt';
import { userRole } from '../../../auth/enum/userRole';
import { ThumbnailProductDto } from '../../../modules/products/DTO/thumbnailProduct.dto';

dotenv.config();

describe('ProductController Integration Test', () => {
  let app: INestApplication;
  let service: ProductService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let productRepository: ProductRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProductModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.TEST_DB_HOST,
          port: Number(process.env.TEST_DB_PORT),
          username: process.env.TEST_DB_USER,
          password: process.env.TEST_DB_PASSWORD,
          database: process.env.TEST_DB_NAME,
          entities: [__dirname + '/../../../modules/**/*.entity.ts'],
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
    await productRepository.deleteAll();
  });

  afterAll(async () => {
    await app.close();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  
  it('should return product list', async () => {
    const product1 = new Product('test product 1', 100, 'description 1');
    const product2 = new Product('test product 2', 50, 'description 2');
    
    await productRepository.add(product1);
    await productRepository.add(product2);

    const response = await request(app.getHttpServer())
      .get('/products/list')
      .expect(200);

    const listProductDto1 = new listProudctDto(product1.name, product1.price);
    listProductDto1.averageRating = 0;
    listProductDto1.category = "";
    listProductDto1.productId = 1;
    listProductDto1.thumbnailUrl = "null";
    
    const listProductDto2 = new listProudctDto(product2.name, product2.price);
    listProductDto2.averageRating = 0;
    listProductDto2.category = "";
    listProductDto2.productId = 2;
    listProductDto2.thumbnailUrl = "null";

    expect(response.body).toEqual(
      [
        {...listProductDto1, price: listProductDto1.price.toString() + ".00"},
        {...listProductDto2, price: listProductDto2.price.toString() + ".00"},
      ]
    );
  });

  it('should return extended preview', async () => {
    const product = new Product('test product', 100, 'description');
    const productId = await productRepository.add(product);

    const response = await request(app.getHttpServer())
      .post(`/products/extended-previews`)
      .send({ids: [productId]})
      .expect(201);

    const extendedPreviewProductDto = new ExtendedPreviewProductDto(product.name, product.price);
    extendedPreviewProductDto.productId = 1;
    extendedPreviewProductDto.quantity = 0;
    extendedPreviewProductDto.thumbnailUrl = "null";

    expect(response.body).toEqual([
      {...extendedPreviewProductDto, price: extendedPreviewProductDto.price.toString() + ".00"}]
    );
  });

  it('should return 401 instead of all products with thumbnails when not authorized', async () => {
    const product1 = new Product('test product 1', 100, 'description 1');
    const product2 = new Product('test product 2', 50, 'description 2');

    await productRepository.add(product1);
    await productRepository.add(product2);

    const response = await request(app.getHttpServer())
      .get('/products/all-with-thumbnails')
      .set('Cookie', ['auth_token=invalid_token'])
      .expect(401);

    expect(response.body).toEqual({"message": "Unauthorized", "statusCode": 401});
  });

  it('should return all products with thumbnails when authorized', async () => {
    const product1 = new Product('test product 1', 100, 'description 1');
    const product2 = new Product('test product 2', 50, 'description 2');

    const product1Id = await productRepository.add(product1);
    const product2Id = await productRepository.add(product2);

    const thumbnailProductDto1 = new ThumbnailProductDto();
    thumbnailProductDto1.id = product1Id;
    thumbnailProductDto1.name = product1.name;
    thumbnailProductDto1.price = product1.price;
    thumbnailProductDto1.thumbnail = "null";
    thumbnailProductDto1.alt = "null";
    thumbnailProductDto1.quantity = 0;

    const thumbnailProductDto2 = new ThumbnailProductDto();
    thumbnailProductDto2.id = product2Id;
    thumbnailProductDto2.name = product2.name;
    thumbnailProductDto2.price = product2.price;
    thumbnailProductDto2.thumbnail = "null";
    thumbnailProductDto2.alt = "null";
    thumbnailProductDto2.quantity = 0;

    const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
    const validToken = jwtService.sign({
      user_id: 1,
      role: userRole.EMPLOYEE,
    });

    const response = await request(app.getHttpServer())
      .get('/products/all-with-thumbnails')
      .set('Cookie', [`auth_token=${validToken}`])
      .expect(200);

    expect(response.body).toEqual([
      {...thumbnailProductDto1, price: thumbnailProductDto1.price.toString() + ".00"},
      {...thumbnailProductDto2, price: thumbnailProductDto2.price.toString() + ".00"},
    ]);
  });

});
