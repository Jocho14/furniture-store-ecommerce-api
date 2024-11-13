import { Controller } from "@nestjs/common";

import { GuestService } from "./guest.service";

@Controller("guests")
export class GuestController {
  constructor(private readonly guestService: GuestService) {}
}
