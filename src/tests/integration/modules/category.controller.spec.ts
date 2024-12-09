import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource, QueryRunner } from "typeorm";
import request from "supertest";
import * as dotenv from "dotenv";

import { CategoryService } from "../../../modules/categories/category.service";
import { CategoryRepository } from "../../../modules/categories/category.repository";
import { Category } from "../../../modules/categories/category.entity";
import { CategoryModule } from "../../../modules/categories/category.module";

dotenv.config();

describe("CategoryController Integration Test", () => {
  let app: INestApplication;
  let service: CategoryService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let categoryRepository: CategoryRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CategoryModule,
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
        TypeOrmModule.forFeature([Category]),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get<CategoryService>(CategoryService);
    dataSource = module.get<DataSource>(DataSource);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
  });

  beforeEach(async () => {
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    await queryRunner.commitTransaction();
  });

  afterEach(async () => {});

  afterAll(async () => {
    await app.close();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it("should return masonry categories", async () => {
    const categoryId = 1;
    const response = await request(app.getHttpServer())
      .get(`/categories/${categoryId}/masonry`)
      .expect(200);

    expect(response.body).toEqual({
      name: "bedroom",
      imageUrls: [
        "https://firebasestorage.googleapis.com/v0/b/furniture-store-ecommerce.appspot.com/o/images%2Fcategories%2F1%2Fmasonry_img_1.png?alt=media&token=112c35c7-8aa1-4d97-962c-87daeec5017f",
        "https://firebasestorage.googleapis.com/v0/b/furniture-store-ecommerce.appspot.com/o/images%2Fcategories%2F1%2Fmasonry_img_2.png?alt=media&token=a56f8d35-1620-470d-83a6-807efc4dd5d1",
        "https://firebasestorage.googleapis.com/v0/b/furniture-store-ecommerce.appspot.com/o/images%2Fcategories%2F1%2Fmasonry_img_3.png?alt=media&token=691e71a4-65df-4952-9538-c67b48d6a29f",
        "https://firebasestorage.googleapis.com/v0/b/furniture-store-ecommerce.appspot.com/o/images%2Fcategories%2F1%2Fmasonry_img_4.png?alt=media&token=e8a2c92c-ff3b-43bb-8e3c-5d05c63c75cb",
        "https://firebasestorage.googleapis.com/v0/b/furniture-store-ecommerce.appspot.com/o/images%2Fcategories%2F1%2Fmasonry_img_5.png?alt=media&token=9d806a7e-834e-4ddc-a807-2d02d0c07039",
        "https://firebasestorage.googleapis.com/v0/b/furniture-store-ecommerce.appspot.com/o/images%2Fcategories%2F1%2Fmasonry_img_6.png?alt=media&token=294d954c-6d1e-4a5b-9f4f-3b252c4fed37",
      ],
    });
  });
});
