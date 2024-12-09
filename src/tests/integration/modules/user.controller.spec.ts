import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource, QueryRunner } from "typeorm";
import request from "supertest";

import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";

import { UserService } from "../../../modules/users/user.service";
import { UserRepository } from "../../../modules/users/user.repository";
import { User } from "../../../modules/users/user.entity";
import { UserModule } from "../../../modules/users/user.module";

import { AccountRepository } from "../../../modules/accounts/account.repository";

import { JwtService } from "@nestjs/jwt";
import { userRole } from "../../../auth/enum/userRole";
import { ThumbnailProductDto } from "../../../modules/products/DTO/thumbnailProduct.dto";
import { AccountCreateDto } from "../../../modules/accounts/DTO/accountCreate.dto";
import { UserCreateDto } from "../../../modules/users/DTO/userCreate.dto";

dotenv.config();

describe("ProductController Integration Test", () => {
  let app: INestApplication;
  let service: UserService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let userRepository: UserRepository;
  let accountRepository: AccountRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
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
        TypeOrmModule.forFeature([User]),
      ],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    service = module.get<UserService>(UserService);
    dataSource = module.get<DataSource>(DataSource);
    userRepository = module.get<UserRepository>(UserRepository);
    accountRepository = module.get<AccountRepository>(AccountRepository);
  });

  beforeEach(async () => {
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await queryRunner.query(`
      ALTER SEQUENCE users_user_id_seq RESTART WITH 1;
    `);
    await queryRunner.query(`
      ALTER SEQUENCE accounts_account_id_seq RESTART WITH 1;
    `);
    await queryRunner.commitTransaction();
  });

  afterEach(async () => {
    await userRepository.deleteAll();
    await accountRepository.deleteAll();
  });

  afterAll(async () => {
    await app.close();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it("should create a client account", async () => {
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
  });

  it("should create an employee account", async () => {
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
  });

  it("should return 401 when requesting account basic info when unauthorized", async () => {
    await request(app.getHttpServer())
      .get("/users/account-basic-info")
      .expect(401);
  });

  it("should return account basic info", async () => {
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

    const basicInfo = await request(app.getHttpServer())
      .get("/users/account-basic-info")
      .set("Cookie", [`${login.headers["set-cookie"]}`])
      .expect(200);

    expect(basicInfo.body).toEqual({
      ...basicInfo.body,
      role: userRole.CLIENT,
      firstName: userCreateDto.firstName,
    });
  });
});
