import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderDetailsResponseDto } from './dtos/order-details-response.dto';
import { OrderResponseDto } from './dtos/order-response.dto';
import { OrdersService } from './orders.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Auth } from 'src/auth/guards/auth.guard';
import { UniqueConstraintError } from 'src/core/errors/unique-constraint.error';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @Auth()
  async findAll(@CurrentUser() user: User) {
    const orders = await this.ordersService.findAll(user.id);

    return orders.map((c) => new OrderResponseDto(c));
  }

  @Get(':id')
  @Auth()
  async findOne(@Param('id') id: number, @CurrentUser() user: User) {
    const order = await this.ordersService.findById(id);

    if (!order) throw new NotFoundException();

    if (order.userId !== user.id) {
      throw new UnauthorizedException();
    }

    return new OrderDetailsResponseDto(order);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth()
  async create(@CurrentUser() user: User, @Body() form: CreateOrderDto) {
    try {
      const order = await this.ordersService.create(user.id, form);

      return new OrderResponseDto(order);
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        throw new UnprocessableEntityException(e.message);
      }
    }
  }
}
