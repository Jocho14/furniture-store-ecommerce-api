import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource, QueryRunner } from "typeorm";
import request from "supertest";

import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";

import { AuthService } from "../../../auth/auth.service";
import { AuthModule } from "../../../auth/auth.module";

import { UserRepository } from "../../../modules/users/user.repository";
import { AccountRepository } from "../../../modules/accounts/account.repository";

import { JwtService } from "@nestjs/jwt";
import { userRole } from "../../../auth/enum/userRole";
import { ThumbnailProductDto } from "../../../modules/products/DTO/thumbnailProduct.dto";
import { AccountCreateDto } from "../../../modules/accounts/DTO/accountCreate.dto";
import { UserCreateDto } from "../../../modules/users/DTO/userCreate.dto";

dotenv.config();

describe("ProductController Integration Test", () => {
  let app: INestApplication;
  let service: AuthService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let userRepository: UserRepository;
  let accountRepository: AccountRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
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
      ],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    service = module.get<AuthService>(AuthService);
    dataSource = module.get<DataSource>(DataSource);
    userRepository = module.get<UserRepository>(UserRepository);
    accountRepository = module.get<AccountRepository>(AccountRepository);
  });

  beforeEach(async () => {
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.startTransaction();
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
    await accountRepository.deleteAll();
    await userRepository.deleteAll();
  });

  afterAll(async () => {
    await app.close();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it("should sucessfully log in", async () => {
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

    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...accountCreateDto })
      .expect(201);
  });

  it("should return 404 when account not found", async () => {
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
      .post("/auth/login")
      .send({ ...accountCreateDto })
      .expect(404);
  });

  it("should sucessfully return auth status for existing account and valid credentials", async () => {
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

    await request(app.getHttpServer())
      .get("/auth/status")
      .set("Cookie", [`${login.headers["set-cookie"]}`])
      .expect(200);
  });

  it("should return 401 when entering wrong password", async () => {
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

    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...accountCreateDto, password: "wrong password" })
      .expect(401);
  });
});
