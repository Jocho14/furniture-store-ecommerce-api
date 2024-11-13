import { Injectable } from "@nestjs/common";
import { OrderRepository } from "./order.repository";

import { CreateGuestOrderDto } from "./DTO/createGuestOrder.dto";
import { GuestService } from "../guests/guest.service";
import { ShippingAddressService } from "../shipping-addresses/shipping-address.service";
import { Order } from "./order.entity";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly guestService: GuestService,
    private readonly shippingAddressService: ShippingAddressService
  ) {}

  async createGuestOrder(createGuestOrderDto: CreateGuestOrderDto) {
    const guest = await this.guestService.createGuest(
      createGuestOrderDto.guestDto
    );
    const shippingAddress =
      await this.shippingAddressService.createShippingAddress(
        createGuestOrderDto.shippingAddressDto
      );

    // NOTE: Total amount is hardcoded to 200 for now
    const order = new Order(
      shippingAddress.shipping_address_id,
      200,
      null,
      guest.guest_id
    );

    return await this.orderRepository.create(order);
  }
}
