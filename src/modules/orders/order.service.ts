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
import { EmployeeOrderManageDto } from "./DTO/employeeOrderManage.dto";
import { UserService } from "../users/user.service";
import { ClientService } from "../clients/client.service";
import { ExtendedPreviewProductDto } from "../products/DTO/extendedPreviewProduct.dto";
import { UserOrderInfoDto } from "../users/DTO/userOrderInfo.dto";
import { ShippingAddressOrderDto } from "../shipping-addresses/DTO/createShippingAddress.dto";
import { AuthenticatedUser } from "../../auth/interface/IAuth";
import { CreateClientOrderDto } from "./DTO/createClientOrder.dto";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly guestService: GuestService,
    private readonly shippingAddressService: ShippingAddressService,
    private readonly productService: ProductService,
    private readonly orderProductService: OrderProductService,
    private readonly userService: UserService,
    private readonly clientService: ClientService
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

  async createClientOrder(
    req: AuthenticatedUser,
    createClientOrderDto: CreateClientOrderDto
  ): Promise<number | null> {
    if (req.user?.user_id === null) {
      return null;
    }

    const client = await this.userService.getUserOrderInfo(
      req.user?.user_id || null
    );
    if (client === null) {
      return null;
    }
    const clientId = await this.userService.getClientId(
      req.user?.user_id || null
    );
    if (clientId === null) return null;

    const shippingAddress =
      await this.shippingAddressService.createShippingAddress(
        createClientOrderDto.shippingAddressDto
      );

    const products = await this.productService.getProducts(
      createClientOrderDto.orderProductDtos.map((p) => p.productId)
    );

    let totalAmount = 0;
    products?.forEach((product) => {
      const productDto = createClientOrderDto.orderProductDtos.find(
        (p) => p.productId === product.product_id
      );
      if (productDto) {
        totalAmount += product.price * productDto.quantity;
      }
    });

    const order = new Order(
      shippingAddress.shipping_address_id,
      totalAmount,
      clientId,
      null
    );

    const createdOrder = await this.orderRepository.create(order);

    await Promise.all(
      createClientOrderDto.orderProductDtos.map((productDto) =>
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

  async getClientEmail(orderId: number): Promise<string | undefined> {
    const order = await this.orderRepository.getOrder(orderId);
    if (order === null) {
      return undefined;
    }

    const clientId = order.client_id;
    if (!clientId) return undefined;

    const userId = await this.clientService.getUserId(clientId);
    if (!userId) return undefined;

    const email = await this.userService.getAccountEmail(userId);
    return email ? email : undefined;
  }

  async getEmployeePreviews(): Promise<EmployeeOrderPreviewDto[]> {
    const orders = await this.orderRepository.getAll();
    const previews = await Promise.all(
      orders.map(async (order) => {
        const userId = await this.clientService.getUserId(order.client_id);
        let email = order.guest_id
          ? await this.guestService.getEmail(order.order_id)
          : await this.userService.getAccountEmail(userId);
        email = email || "";
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

  async getManageOrder(
    orderId: number
  ): Promise<EmployeeOrderManageDto | null> {
    const order = await this.orderRepository.getOrder(orderId);
    if (!order) {
      return null;
    }
    const employeeOrderManageDto = new EmployeeOrderManageDto();
    const userOrderInfoDto = new UserOrderInfoDto();
    const shippingAddressOrderDto = new ShippingAddressOrderDto();

    employeeOrderManageDto.customer = userOrderInfoDto;
    employeeOrderManageDto.shipping = shippingAddressOrderDto;

    employeeOrderManageDto.status = order.status;
    employeeOrderManageDto.date = order.order_date;

    if (order.client_id !== null) {
      employeeOrderManageDto.customer.type = "Client";
      const userId = await this.clientService.getUserId(order.client_id);
      if (userId === null) {
        return null;
      }
      const user = await this.userService.getUserOrderInfo(userId);
      if (user === null) {
        return null;
      }

      employeeOrderManageDto.customer.firstName = user.first_name;
      employeeOrderManageDto.customer.lastName = user.last_name;

      const email = await this.userService.getAccountEmail(userId);
      employeeOrderManageDto.customer.email = email || "";

      employeeOrderManageDto.customer.phoneNumber = user.phone_number;
    } else {
      employeeOrderManageDto.customer.type = "Guest";
      if (order.guest_id === null) {
        return null;
      }
      const guest = await this.guestService.getGuest(order.guest_id);
      if (guest === null) {
        return null;
      }

      employeeOrderManageDto.customer.firstName = guest.first_name;
      employeeOrderManageDto.customer.lastName = guest.last_name;
      employeeOrderManageDto.customer.email = guest.email;
      employeeOrderManageDto.customer.phoneNumber = guest.phone_number;
    }

    const shippingAddress =
      await this.shippingAddressService.getShippingAddress(
        order.shipping_address_id
      );

    if (shippingAddress === null) {
      return null;
    }

    employeeOrderManageDto.shipping.streetAddress =
      shippingAddress.street_address;
    employeeOrderManageDto.shipping.houseNumber = shippingAddress.house_number;
    employeeOrderManageDto.shipping.apartmentNumber =
      shippingAddress.apartment_number;
    employeeOrderManageDto.shipping.postalCode = shippingAddress.postal_code;
    employeeOrderManageDto.shipping.city = shippingAddress.city;

    const products = await this.orderProductService.getProducts(orderId);

    const orderProducts = await Promise.all(
      products.map(async (product) => {
        const productInfo = await this.productService.getProductForOrder(
          product.product_id
        );
        if (productInfo === null) {
          return null;
        }
        return {
          product_id: product.product_id,
          name: productInfo.name,
          thumbnailUrl: productInfo.thumbnailUrl,
          price: product.product_price,
          quantity: product.quantity,
        };
      })
    );

    employeeOrderManageDto.products = orderProducts.filter(
      (product) => product !== null
    );

    return employeeOrderManageDto;
  }
}
