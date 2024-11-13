import { Injectable } from "@nestjs/common";
import { GuestRepository } from "./guest.repository";

import { CreateGuestDto } from "./DTO/createGuest.dto";
import { Guest } from "./guest.entity";

@Injectable()
export class GuestService {
  constructor(private readonly guestRepository: GuestRepository) {}

  async createGuest(createGuestDto: CreateGuestDto): Promise<Guest> {
    const guest = new Guest(
      createGuestDto.firstName,
      createGuestDto.lastName,
      createGuestDto.phoneNumber,
      createGuestDto.email
    );
    return await this.guestRepository.create(guest);
  }
}
