import { Injectable } from "@nestjs/common";
import { ClientRepository } from "./client.repository";
import { Client } from "./client.entity";
import { AccountService } from "../accounts/account.service";

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async create(client: Client): Promise<any> {
    return await this.clientRepository.createClient(client);
  }
}
