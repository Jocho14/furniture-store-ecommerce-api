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

  async getUserId(id: number): Promise<number | null> {
    const client = await this.repository.findOne({ where: { client_id: id } });
    return client ? client.user_id : null;
  }

  async getClientId(userId: number): Promise<number | null> {
    const client = await this.repository.findOne({
      where: { user_id: userId },
    });
    return client ? client.client_id : null;
  }
}
