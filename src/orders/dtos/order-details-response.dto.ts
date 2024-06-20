import { Order } from '@prisma/client';
import { Expose, Type } from 'class-transformer';

import { OrderItemDetailsResponseDto } from './order-item-details-response.dto';

export class OrderDetailsResponseDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => OrderItemDetailsResponseDto)
  items: OrderItemDetailsResponseDto[];

  constructor(order: Order) {
    Object.assign(this, order);
  }
}