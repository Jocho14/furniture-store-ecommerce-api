import { Injectable } from "@nestjs/common";
import { OrderRepository } from "./order.repository";

import { CreateGuestOrderDto } from "./DTO/createGuestOrder.dto";
import { GuestService } from "../guests/guest.service";
import { ShippingAddressService } from "../shipping-addresses/shipping-address.service";
import { ProductService } from "../products/product.service";
import { OrderProductService } from "../orders-products/order-product.service";
import { Order } from "./order.entity";
import { LineItemDto } from "./DTO/lineItem.dto";
import { OrderProduct } from "../orders-products/order-product.entity";
import { EmployeeOrderPreviewDto } from "./DTO/employeeOrderPreview.dto";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly guestService: GuestService,
    private readonly shippingAddressService: ShippingAddressService,
    private readonly productService: ProductService,
    private readonly orderProductService: OrderProductService
  ) {}

  async createGuestOrder(
    createGuestOrderDto: CreateGuestOrderDto
  ): Promise<number> {
    const guest = await this.guestService.createGuest(
      createGuestOrderDto.guestDto
    );
    const shippingAddress =
      await this.shippingAddressService.createShippingAddress(
        createGuestOrderDto.shippingAddressDto
      );

    const products = await this.productService.getProducts(
      createGuestOrderDto.orderProductDtos.map((p) => p.productId)
    );

    let totalAmount = 0;
    products?.forEach((product) => {
      const productDto = createGuestOrderDto.orderProductDtos.find(
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

    const createdOrder = await this.orderRepository.create(order);

    await Promise.all(
      createGuestOrderDto.orderProductDtos.map((productDto) =>
        this.orderProductService.createOrderProduct({
          orderId: createdOrder.order_id,
          productId: productDto.productId,
          productPrice: products?.find(
            (p) => p.product_id === productDto.productId
          )?.price,
          quantity: productDto.quantity,
        })
      )
    );

    return createdOrder.order_id;
  }

  async getOrder(orderId: number): Promise<Order | null> {
    return await this.orderRepository.getOrder(orderId);
  }

  async getProducts(orderId: number): Promise<OrderProduct[]> {
    return await this.orderProductService.getProducts(orderId);
  }

  async getGuestEmail(orderId: number): Promise<string | undefined> {
    const guestId = await this.orderRepository.getGuestId(orderId);
    if (!guestId) return undefined;
    const email = await this.guestService.getEmail(guestId);
    return email;
  }

  async getEmployeePreviews(): Promise<EmployeeOrderPreviewDto[]> {
    const orders = await this.orderRepository.getAll();
    const previews = await Promise.all(
      orders.map(async (order) => {
        const email = await this.guestService.getEmail(order.order_id);
        return {
          id: order.order_id,
          status: order.status,
          email: email,
          amount: order.total_amount,
          date: order.order_date,
        };
      })
    );
    return previews;
  }
}
