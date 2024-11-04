import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Client } from "./client.entity";

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>
  ) {}

  async findAll(): Promise<Client[]> {
    return this.repository.find();
  }

  async createClient(client: Client): Promise<Client> {
    return await this.repository.save(client);
  }
}
