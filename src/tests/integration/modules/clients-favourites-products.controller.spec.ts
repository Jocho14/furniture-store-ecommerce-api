import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import request from 'supertest';

import cookieParser from "cookie-parser";
import * as dotenv from 'dotenv';

import { ProductService } from '../../../modules/products/product.service';
import { ProductRepository } from '../../../modules/products/product.repository';
import { Product } from '../../../modules/products/product.entity';

import { UserRepository } from '../../../modules/users/user.repository';
import { UserCreateDto } from '../../../modules/users/DTO/userCreate.dto';

import { AccountRepository } from '../../../modules/accounts/account.repository';
import { AccountCreateDto } from '../../../modules/accounts/DTO/accountCreate.dto';

import { ClientFavouriteProductRepository } from '../../../modules/clients-favourites-products/client-favourite-product.repository';
import { ClientFavouriteProductService } from '../../../modules/clients-favourites-products/client-favourite-product.service';
import { ClientFavouriteProductModule } from '../../../modules/clients-favourites-products/client-favourite-product.module';
import { ClientFavouriteProduct } from '../../../modules/clients-favourites-products/client-favourite-product.entity';

dotenv.config();

describe('ClientsFavouritesProductsController Integration Test', () => {
  let app: INestApplication;
  let service: ProductService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let clientFavouriteProductRepository: ClientFavouriteProductRepository;
  let productRepository: ProductRepository;
  let accountRepository: AccountRepository;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClientFavouriteProductModule,
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
        TypeOrmModule.forFeature([ClientFavouriteProduct]),
      ],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    service = module.get<ProductService>(ClientFavouriteProductService);
    dataSource = module.get<DataSource>(DataSource);
    clientFavouriteProductRepository = module.get<ClientFavouriteProductRepository>(ClientFavouriteProductRepository);
    productRepository = module.get<ProductRepository>(ProductRepository);
    accountRepository = module.get<AccountRepository>(AccountRepository);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  beforeEach(async () => {
      queryRunner = dataSource.createQueryRunner();
      await queryRunner.startTransaction();
      await queryRunner.query(`
        ALTER SEQUENCE products_product_id_seq RESTART WITH 1;
      `);
      await queryRunner.query(`
        ALTER SEQUENCE clients_client_id_seq RESTART WITH 1;
      `);
      await queryRunner.commitTransaction();
  });

  afterEach(async () => {
    await clientFavouriteProductRepository.deleteAll();
    await productRepository.deleteAll();
    await accountRepository.deleteAll();
    await userRepository.deleteAll();
  });

  afterAll(async () => {
    await app.close();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('should add a product to favourites', async () => {
    const accountCreateDto = new AccountCreateDto();
    accountCreateDto.email = 'example@email.com';
    accountCreateDto.password = 'password';

    const userCreateDto = new UserCreateDto();
    userCreateDto.account = accountCreateDto;
    userCreateDto.dateOfBirth = new Date('1990-01-01');
    userCreateDto.firstName = 'Jan';
    userCreateDto.lastName = 'Kowalski';
    userCreateDto.phoneNumber = '123456789';

    await request(app.getHttpServer())
      .post('/users/create-client')
      .send({...userCreateDto})
      .expect(201);

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({...accountCreateDto})
      .expect(201);

    const product = new Product('test product 1', 100, 'description 1');
    const addedProductId = await productRepository.add(product);

    const response = await request(app.getHttpServer())
        .post('/clients-favourites-products/1/add')
        .set('Cookie', [`${login.headers['set-cookie']}`])
        .expect(201);

    expect(response.body).toEqual({ client_id: 1, product_id: addedProductId.toString() });

    const checkResponse = await request(app.getHttpServer())
    .get('/clients-favourites-products/1/check')
    .set('Cookie', [`${login.headers['set-cookie']}`])
    .expect(200);

  expect(checkResponse.body.isFavourite).toEqual(true);
});

it('should remove a product from favourites', async () => {
    const accountCreateDto = new AccountCreateDto();
    accountCreateDto.email = 'example@email.com';
    accountCreateDto.password = 'password';

    const userCreateDto = new UserCreateDto();
    userCreateDto.account = accountCreateDto;
    userCreateDto.dateOfBirth = new Date('1990-01-01');
    userCreateDto.firstName = 'Jan';
    userCreateDto.lastName = 'Kowalski';
    userCreateDto.phoneNumber = '123456789';

    await request(app.getHttpServer())
      .post('/users/create-client')
      .send({...userCreateDto})
      .expect(201);

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({...accountCreateDto})
      .expect(201);

    const product = new Product('test product 1', 100, 'description 1');
    const addedProductId = await productRepository.add(product);

    const addResponse = await request(app.getHttpServer())
        .post('/clients-favourites-products/1/add')
        .set('Cookie', [`${login.headers['set-cookie']}`])
        .expect(201);

    expect(addResponse.body).toEqual({ client_id: 1, product_id: addedProductId.toString() });

    const removeResponse = await request(app.getHttpServer())
        .post('/clients-favourites-products/1/remove')
        .set('Cookie', [`${login.headers['set-cookie']}`])
        .expect(201);

    const checkResponse = await request(app.getHttpServer())
        .get('/clients-favourites-products/1/check')
        .set('Cookie', [`${login.headers['set-cookie']}`])
        .expect(200);

    expect(checkResponse.body.isFavourite).toEqual(false);
  
});

it('should get all favourite products for a client', async () => {
  const accountCreateDto = new AccountCreateDto();
  accountCreateDto.email = 'example@email.com';
  accountCreateDto.password = 'password';

  const userCreateDto = new UserCreateDto();
  userCreateDto.account = accountCreateDto;
  userCreateDto.dateOfBirth = new Date('1990-01-01');
  userCreateDto.firstName = 'Jan';
  userCreateDto.lastName = 'Kowalski';
  userCreateDto.phoneNumber = '123456789';

  await request(app.getHttpServer())
    .post('/users/create-client')
    .send({...userCreateDto})
    .expect(201);

  const login = await request(app.getHttpServer())
    .post('/auth/login')
    .send({...accountCreateDto})
    .expect(201);


    const product1 = new Product('test product 1', 100, 'description 1');
    const addedProductId1 = await productRepository.add(product1);

    const product2 = new Product('test product 2', 50, 'description 2');
    const addedProductId2 = await productRepository.add(product2);

    await request(app.getHttpServer())
      .post(`/clients-favourites-products/${addedProductId1}/add`)
      .set('Cookie', [`${login.headers['set-cookie']}`])
      .expect(201);

    await request(app.getHttpServer())
    .post(`/clients-favourites-products/${addedProductId2}/add`)
      .set('Cookie', [`${login.headers['set-cookie']}`])
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/clients-favourites-products/all')
      .set('Cookie', [`${login.headers['set-cookie']}`])
      .expect(200);

    expect(response.body).toEqual([{
      productId: product1.product_id,
      name: product1.name,
      price: product1.price.toString() + '.00',
      thumbnailUrl: 'null'
    },
    {
      productId: product2.product_id,
      name: product2.name,
      price: product2.price.toString() + '.00',
      thumbnailUrl: 'null'
    }]);
});
});


