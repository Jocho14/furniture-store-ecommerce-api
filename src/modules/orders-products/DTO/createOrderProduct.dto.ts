import { IsNumber, IsNotEmpty } from "class-validator";
import { OrderProductDto } from "./orderProduct.dto";

export class CreateOrderProductDto extends OrderProductDto {
  constructor(
    orderId: number,
    productId: number,
    productPrice: number | undefined,
    quantity: number
  ) {
    super(productId, quantity);
    this.orderId = orderId;
    this.productPrice = productPrice;
  }

  @IsNumber()
  @IsNotEmpty()
  readonly orderId!: number;

  @IsNumber()
  @IsNotEmpty()
  readonly productPrice!: number | undefined;
}
