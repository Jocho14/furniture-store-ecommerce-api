import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource, QueryRunner } from "typeorm";
import request from "supertest";
import * as dotenv from "dotenv";

import { UserRepository } from "../../../modules/users/user.repository";
import { UserCreateDto } from "../../../modules/users/DTO/userCreate.dto";

import { AccountService } from "../../../modules/accounts/account.service";
import { AccountRepository } from "../../../modules/accounts/account.repository";
import { Account } from "../../../modules/accounts/account.entity";
import { AccountModule } from "../../../modules/accounts/account.module";
import { AccountCreateDto } from "../../../modules/accounts/DTO/accountCreate.dto";

dotenv.config();

describe("AccountController Integration Test", () => {
  let app: INestApplication;
  let service: AccountService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let accountRepository: AccountRepository;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AccountModule,
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
        TypeOrmModule.forFeature([Account]),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get<AccountService>(AccountService);
    dataSource = module.get<DataSource>(DataSource);
    accountRepository = module.get<AccountRepository>(AccountRepository);
    userRepository = module.get<UserRepository>(UserRepository);
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

  it("should return account by email", async () => {
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

    const response = await request(app.getHttpServer())
      .get("/accounts/example@email.com")
      .expect(200);

    expect(response.body).toEqual({
      ...response.body,
      email: accountCreateDto.email,
    });
  });
});
