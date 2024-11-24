import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { ClientRepository } from "./client.repository";
import { Client } from "./client.entity";
import { CreateReviewDto } from "../reviews/DTO/createReview.dto";

import { UserService } from "../users/user.service";

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  async create(client: Client): Promise<any> {
    return await this.clientRepository.createClient(client);
  }

  async getUserFirstName(id: number): Promise<string | null> {
    return await this.userService.getUserFirstName(id);
  }

  async getClientId(userId: number): Promise<number | null> {
    return await this.clientRepository.getClientId(userId);
  }

  async getUserId(id: number): Promise<number | null> {
    return await this.clientRepository.getUserId(id);
  }
}
