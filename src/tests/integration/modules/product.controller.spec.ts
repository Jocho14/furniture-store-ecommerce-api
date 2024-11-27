import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import request from 'supertest';
import * as dotenv from 'dotenv';

import { ProductService } from '../../../modules/products/product.service';
import { ProductController } from '../../../modules/products/product.controller';
import { ProductRepository } from '../../../modules/products/product.repository';
import { Product } from '../../../modules/products/product.entity';
import { ProductModule } from '../../../modules/products/product.module';
import { Image } from '../../../modules/images/image.entity';
import { Review } from '../../../modules/reviews/review.entity';

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
          entities: [__dirname + '../../../modules/**/*.entity{.ts,.js}'],
          synchronize: false,
        }),
        TypeOrmModule.forFeature([Product]),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get<ProductService>(ProductService);
    dataSource = module.get<DataSource>(DataSource);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  beforeEach(async () => {
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }
    await queryRunner.release();
  });

  afterAll(async () => {
    await app.close();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });


  it('should return product list', async () => {
    const product = new Product('test product', 100, 'description');
    await productRepository.add(product);

    const response = await request(app.getHttpServer())
      .get('/products/list')
      .expect(201);

    expect(response.body.name).toBe([product]);
  });
});
