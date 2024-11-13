import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateGuestDto } from "./DTO/createGuest.dto";

import { Guest } from "./guest.entity";

@Injectable()
export class GuestRepository {
  constructor(
    @InjectRepository(Guest)
    private readonly repository: Repository<Guest>
  ) {}

  async create(guest: Guest): Promise<Guest> {
    return await this.repository.save(guest);
  }
}
