import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray } from 'class-validator';

import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @Type(() => CreateOrderItemDto)
  @IsArray()
  @ArrayMinSize(1)
  items: CreateOrderItemDto[];
}
