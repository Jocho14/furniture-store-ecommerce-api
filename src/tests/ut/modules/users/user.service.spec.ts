import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../../../modules/users/user.service";
import { UserRepository } from "../../../../modules/users/user.repository";
import { AccountService } from "../../../../modules/accounts/account.service";
import { ClientService } from "../../../../modules/clients/client.service";
import { EmployeeService } from "../../../../modules/employees/employee.service";
import { UserCreateDto } from "../../../../modules/users/DTO/userCreate.dto";
import { User } from "../../../../modules/users/user.entity";
import { Account } from "../../../../modules/accounts/account.entity";
import { Client } from "../../../../modules/clients/client.entity";
import { userRole } from "../../../../auth/enum/userRole";
import { AuthenticatedUser } from "../../../../auth/interface/IAuth";

describe("UserService", () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let accountService: AccountService;
  let clientService: ClientService;
  let employeeService: EmployeeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findAll: jest.fn(),
            createUser: jest.fn(),
            getFirstName: jest.fn(),
          },
        },
        {
          provide: AccountService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ClientService,
          useValue: {
            create: jest.fn(),
            getClientId: jest.fn(),
            getUserFirstName: jest.fn(),
          },
        },
        {
          provide: EmployeeService,
          useValue: {
            getEmployeeId: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    accountService = module.get<AccountService>(AccountService);
    clientService = module.get<ClientService>(ClientService);
    employeeService = module.get<EmployeeService>(EmployeeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(userService).toBeDefined();
  });

  it("should find all users", async () => {
    const users = [new User("Jan", "Kowalski", "123123123", new Date())];
    jest.spyOn(userRepository, "findAll").mockResolvedValue(users);

    expect(await userService.findAll()).toBe(users);
  });

  it("should create a user", async () => {
    const userCreateDto: UserCreateDto = {
      firstName: "Jan",
      lastName: "Kowalski",
      phoneNumber: "123123123",
      dateOfBirth: new Date(),
      account: {
        email: "test@example.com",
        password: "password",
      },
    };
    const user = new User(
      userCreateDto.firstName,
      userCreateDto.lastName,
      userCreateDto.phoneNumber,
      userCreateDto.dateOfBirth
    );
    const createUserResponse = { user_id: 1 } as User;
    jest
      .spyOn(userRepository, "createUser")
      .mockResolvedValue(createUserResponse);
    jest
      .spyOn(accountService, "create")
      .mockResolvedValue(null as unknown as Account);
    jest.spyOn(clientService, "create").mockResolvedValue(undefined);

    expect(await userService.create(userCreateDto)).toBe(createUserResponse);
    expect(userRepository.createUser).toHaveBeenCalledWith(user);
    expect(accountService.create).toHaveBeenCalledWith(expect.any(Account));
    expect(clientService.create).toHaveBeenCalledWith(expect.any(Client));
  });

  it("should get user first name", async () => {
    const firstName = "Jan";
    jest.spyOn(userRepository, "getFirstName").mockResolvedValue(firstName);

    expect(await userService.getUserFirstName(1)).toBe(firstName);
  });

  it("should get client id", async () => {
    const clientId = 1;
    jest.spyOn(clientService, "getClientId").mockResolvedValue(clientId);

    expect(await userService.getClientId(1)).toBe(clientId);
  });

  it("should get user role as CLIENT", async () => {
    jest.spyOn(clientService, "getClientId").mockResolvedValue(1);
    jest.spyOn(employeeService, "getEmployeeId").mockResolvedValue(null);

    expect(await userService.getUserRole(1)).toBe(userRole.CLIENT);
  });

  it("should get user role as EMPLOYEE", async () => {
    jest.spyOn(clientService, "getClientId").mockResolvedValue(null);
    jest.spyOn(employeeService, "getEmployeeId").mockResolvedValue(1);

    expect(await userService.getUserRole(1)).toBe(userRole.EMPLOYEE);
  });

  it("should return null if user role is not found", async () => {
    jest.spyOn(clientService, "getClientId").mockResolvedValue(null);
    jest.spyOn(employeeService, "getEmployeeId").mockResolvedValue(null);

    expect(await userService.getUserRole(1)).toBeNull();
  });

  it("should get client basic info", async () => {
    const req: AuthenticatedUser = {
      user: {
        user_id: 1,
        account_id: 1,
        account: null,
        first_name: "Jan",
        last_name: "Kowalski",
        phone_number: "123123123",
        date_of_birth: new Date(),
      } as unknown as AuthenticatedUser["user"],
    } as AuthenticatedUser;
    const firstName = "Jan";
    jest.spyOn(clientService, "getUserFirstName").mockResolvedValue(firstName);

    const result = await userService.getClientBasicInfo(req);
    expect(result).toEqual({
      accountId: 1,
      role: undefined,
      firstName: firstName,
    });
  });

  it("should return null if user is not authenticated", async () => {
    const req: AuthenticatedUser = {
      user: null,
    } as unknown as AuthenticatedUser;

    expect(await userService.getClientBasicInfo(req)).toBeNull();
  });
});
