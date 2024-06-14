import { IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  @Min(1)
  productId: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  price: number;
}
