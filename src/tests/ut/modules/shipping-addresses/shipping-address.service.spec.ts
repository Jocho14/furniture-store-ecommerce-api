import { Test, TestingModule } from "@nestjs/testing";
import { ShippingAddressService } from "../../../../modules/shipping-addresses/shipping-address.service";
import { ShippingAddressRepository } from "../../../../modules/shipping-addresses/shipping-address.repository";
import { CreateShippingAddressDto } from "../../../../modules/shipping-addresses/DTO/createShippingAddress.dto";
import { ShippingAddress } from "../../../../modules/shipping-addresses/shipping-address.entity";

describe("ShippingAddressService", () => {
  let service: ShippingAddressService;
  let repository: ShippingAddressRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShippingAddressService,
        {
          provide: ShippingAddressRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ShippingAddressService>(ShippingAddressService);
    repository = module.get<ShippingAddressRepository>(
      ShippingAddressRepository
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a new shipping address", async () => {
    const createShippingAddressDto: CreateShippingAddressDto = {
      streetAddress: "ul. 3 Maja",
      houseNumber: "1",
      city: "Wroclaw",
      postalCode: "51-119",
      apartmentNumber: "1",
    };

    const shippingAddress = new ShippingAddress(
      createShippingAddressDto.streetAddress,
      createShippingAddressDto.houseNumber,
      createShippingAddressDto.city,
      createShippingAddressDto.postalCode,
      createShippingAddressDto.apartmentNumber
    );

    jest.spyOn(repository, "create").mockResolvedValue(shippingAddress);

    const result = await service.createShippingAddress(
      createShippingAddressDto
    );

    expect(result).toEqual(shippingAddress);
    expect(repository.create).toHaveBeenCalledWith(shippingAddress);
  });
});
