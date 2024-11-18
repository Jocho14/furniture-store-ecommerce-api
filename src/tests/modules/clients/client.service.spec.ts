import { Test, TestingModule } from "@nestjs/testing";
import { ClientService } from "../../../modules/clients/client.service";
import { ClientRepository } from "../../../modules/clients/client.repository";
import { UserService } from "../../../modules/users/user.service";
import { Client } from "../../../modules/clients/client.entity";
import { User } from "../../../modules/users/user.entity";
import { Account } from "../../../modules/accounts/account.entity";

describe("ClientService", () => {
  let service: ClientService;
  let clientRepository: ClientRepository;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: ClientRepository,
          useValue: {
            createClient: jest.fn(),
            getClientId: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserFirstName: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    clientRepository = module.get<ClientRepository>(ClientRepository);
    userService = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a client", async () => {
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
    mockUser.account = mockAccount;
    mockClient.user = mockUser;

    jest.spyOn(clientRepository, "createClient").mockResolvedValue(mockClient);

    expect(await service.create(mockClient)).toBe(mockClient);
    expect(clientRepository.createClient).toHaveBeenCalledWith(mockClient);
  });

  it("should return user first name", async () => {
    const firstName = "John";
    jest.spyOn(userService, "getUserFirstName").mockResolvedValue(firstName);

    expect(await service.getUserFirstName(1)).toBe(firstName);
    expect(userService.getUserFirstName).toHaveBeenCalledWith(1);
  });

  it("should return client id", async () => {
    const clientId = 1;
    jest.spyOn(clientRepository, "getClientId").mockResolvedValue(clientId);

    expect(await service.getClientId(1)).toBe(clientId);
    expect(clientRepository.getClientId).toHaveBeenCalledWith(1);
  });
});
