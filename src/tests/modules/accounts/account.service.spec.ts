import { Test, TestingModule } from "@nestjs/testing";
import { AccountService } from "../../../modules/accounts/account.service";
import { AccountRepository } from "../../../modules/accounts/account.repository";
import { AuthService } from "../../../auth/auth.service";
import { Account } from "../../../modules/accounts/account.entity";
import { Employee } from "../../../modules/employees/employee.entity";
import { User } from "../../../modules/users/user.entity";

describe("AccountService", () => {
  let service: AccountService;
  let accountRepository: AccountRepository;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: AccountRepository,
          useValue: {
            findAll: jest.fn(),
            findByEmail: jest.fn(),
            getPasswordHashForEmail: jest.fn(),
            createAccount: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            hashPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    accountRepository = module.get<AccountRepository>(AccountRepository);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return an account by email", async () => {
    const mockClient = {
      client_id: 1,
      user_id: 1,
      user: {} as User,
      orders: [],
      reviews: [],
    };
    const mockUser = {
      first_name: "Jan",
      last_name: "Kowalski",
      user_id: 1,
      phone_number: "123123123",
      date_of_birth: new Date(),
      account: {} as Account,
      client: mockClient,
      employee: null,
    };
    const mockAccount = {
      email: "test@example.com",
      account_id: 1,
      user_id: 1,
      password_hash: "hashedPassword",
      created_at: new Date(),
      active: true,
      user: mockUser,
    };

    mockUser.account = mockAccount;

    const email = "test@example.com";

    jest.spyOn(accountRepository, "findByEmail").mockResolvedValue(mockAccount);

    expect(await service.findByEmail(email)).toBe(mockAccount);
  });

  it("should return null if account not found", async () => {
    const email = "test@example.com";
    jest.spyOn(accountRepository, "findByEmail").mockResolvedValue(null);

    expect(await service.findByEmail(email)).toBeNull();
  });

  it("should return password hash for email", async () => {
    const mockClient = {
      client_id: 1,
      user_id: 1,
      user: {} as User,
      orders: [],
      reviews: [],
    };
    const mockUser = {
      first_name: "Jan",
      last_name: "Kowalski",
      user_id: 1,
      phone_number: "123123123",
      date_of_birth: new Date(),
      account: {} as Account,
      client: mockClient,
      employee: null,
    };
    const email = "test@example.com";
    const mockAccount = {
      email: "test@example.com",
      account_id: 1,
      user_id: 1,
      password_hash: "hashedPassword",
      created_at: new Date(),
      active: true,
      user: mockUser,
    };
    jest
      .spyOn(accountRepository, "getPasswordHashForEmail")
      .mockResolvedValue(mockAccount);

    expect(await service.getPasswordHashForEmail(email)).toBe(
      mockAccount.password_hash
    );
  });

  it("should return null if account not found", async () => {
    const email = "test@example.com";
    jest
      .spyOn(accountRepository, "getPasswordHashForEmail")
      .mockResolvedValue(null);

    expect(await service.getPasswordHashForEmail(email)).toBeNull();
  });

  it("should create a new account", async () => {
    const mockClient = {
      client_id: 1,
      user_id: 1,
      user: {} as User,
      orders: [],
      reviews: [],
    };
    const mockUser = {
      first_name: "Jan",
      last_name: "Kowalski",
      user_id: 1,
      phone_number: "123123123",
      date_of_birth: new Date(),
      account: {} as Account,
      client: mockClient,
      employee: null,
    };
    const mockAccount = {
      email: "test@example.com",
      account_id: 1,
      user_id: 1,
      password_hash: "plainPassword",
      created_at: new Date(),
      active: true,
      user: mockUser,
    };

    const hashedPassword = "hashedPassword";
    const createdAccount = { ...mockAccount, password_hash: hashedPassword };
    jest.spyOn(authService, "hashPassword").mockResolvedValue(hashedPassword);
    jest
      .spyOn(accountRepository, "createAccount")
      .mockResolvedValue(createdAccount);

    expect(await service.create(mockAccount)).toBe(createdAccount);
    expect(authService.hashPassword).toHaveBeenCalledWith("plainPassword");
    expect(accountRepository.createAccount).toHaveBeenCalledWith({
      ...mockAccount,
      password_hash: hashedPassword,
    });
  });
});
