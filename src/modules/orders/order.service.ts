import { Injectable } from "@nestjs/common";
import { OrderRepository } from "./order.repository";

import { CreateGuestOrderDto } from "./DTO/createGuestOrder.dto";
import { GuestService } from "../guests/guest.service";
import { ShippingAddressService } from "../shipping-addresses/shipping-address.service";
import { ProductService } from "../products/product.service";
import { OrderProductService } from "../orders-products/order-product.service";
import { Order } from "./order.entity";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly guestService: GuestService,
    private readonly shippingAddressService: ShippingAddressService,
    private readonly productService: ProductService,
    private readonly orderProductService: OrderProductService
  ) {}

  async createGuestOrder(createGuestOrderDto: CreateGuestOrderDto) {
    const guest = await this.guestService.createGuest(
      createGuestOrderDto.guestDto
    );
    const shippingAddress =
      await this.shippingAddressService.createShippingAddress(
        createGuestOrderDto.shippingAddressDto
      );

    const products = await this.productService.getProducts(
      createGuestOrderDto.orderProducts.map((p) => p.productId)
    );

    let totalAmount = 0;
    products?.forEach((product) => {
      const productDto = createGuestOrderDto.orderProducts.find(
        (p) => p.productId === product.product_id
      );
      if (productDto) {
        totalAmount += product.price * productDto.quantity;
      }
    });

    const order = new Order(
      shippingAddress.shipping_address_id,
      totalAmount,
      null,
      guest.guest_id
    );

    const savedOrder = await this.orderRepository.create(order);

    await Promise.all(
      createGuestOrderDto.orderProducts.map((productDto) =>
        this.orderProductService.createOrderProduct({
          orderId: savedOrder.order_id,
          productId: productDto.productId,
          productPrice: products?.find(
            (p) => p.product_id === productDto.productId
          )?.price,
          quantity: productDto.quantity,
        })
      )
    );

    return savedOrder;
  }
}
