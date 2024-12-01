import { Test, TestingModule } from "@nestjs/testing";
import { GuestService } from "../../../../modules/guests/guest.service";
import { GuestRepository } from "../../../../modules/guests/guest.repository";
import { CreateGuestDto } from "../../../../modules/guests/DTO/createGuest.dto";
import { Guest } from "../../../../modules/guests/guest.entity";

describe("GuestService", () => {
  let service: GuestService;
  let repository: GuestRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuestService,
        {
          provide: GuestRepository,
          useValue: {
            create: jest.fn(),
            getEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GuestService>(GuestService);
    repository = module.get<GuestRepository>(GuestRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createGuest", () => {
    it("should create a guest", async () => {
      const createGuestDto: CreateGuestDto = {
        firstName: "Jan",
        lastName: "Kowalski",
        phoneNumber: "1234567890",
        email: "test@example",
      };
      const guest = new Guest(
        createGuestDto.firstName,
        createGuestDto.lastName,
        createGuestDto.phoneNumber,
        createGuestDto.email
      );

      jest.spyOn(repository, "create").mockResolvedValue(guest);

      expect(await service.createGuest(createGuestDto)).toEqual(guest);
      expect(repository.create).toHaveBeenCalledWith(guest);
    });
  });

  it("should return the email of the guest", async () => {
    const guestId = 1;
    const email = "test@example";

    jest.spyOn(repository, "getEmail").mockResolvedValue(email);

    expect(await service.getEmail(guestId)).toEqual(email);
    expect(repository.getEmail).toHaveBeenCalledWith(guestId);
  });

  it("should return undefined if guest email is not found", async () => {
    const guestId = 1;

    jest.spyOn(repository, "getEmail").mockResolvedValue(undefined);

    expect(await service.getEmail(guestId)).toBeUndefined();
    expect(repository.getEmail).toHaveBeenCalledWith(guestId);
  });
});
