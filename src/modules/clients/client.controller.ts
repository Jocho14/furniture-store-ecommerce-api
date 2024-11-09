import { Controller, Post, Req, Body, Param, UseGuards } from "@nestjs/common";

import { ClientService } from "./client.service";

@Controller("Clients")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
}
