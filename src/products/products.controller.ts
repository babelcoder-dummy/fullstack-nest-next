import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { CreateProductDto } from './dtos/create-product.dto';
import { FindAllQueryDto } from './dtos/find-all-query.dto';
import { ProductResponseDto } from './dtos/product-response.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';
import { RecordNotFoundError } from 'src/core/errors/record-not-found.error';
import { UniqueConstraintError } from 'src/core/errors/unique-constraint.error';
import { ProductListResponseDto } from './dtos/product-list-response.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: FindAllQueryDto) {
    const itemsPaging = await this.productsService.findAll({
      page: query.page,
      limit: query.limit,
    });

    return new ProductListResponseDto(itemsPaging);
  }

  @Get(':idOrSlug')
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    const product = await this.productsService.findByIdOrSlug(idOrSlug);

    if (!product) throw new NotFoundException();

    return new ProductResponseDto(product);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() form: CreateProductDto) {
    try {
      const product = await this.productsService.create(
        form,
        faker.image.url(),
      );

      return new ProductResponseDto(product);
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        throw new UnprocessableEntityException(e.message);
      }
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() form: UpdateProductDto) {
    try {
      const product = await this.productsService.update(
        id,
        form,
        faker.image.url(),
      );

      return new ProductResponseDto(product);
    } catch (e) {
      if (e instanceof RecordNotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id') id: number) {
    try {
      return await this.productsService.destroy(id);
    } catch (e) {
      if (e instanceof RecordNotFoundError) {
        throw new NotFoundException();
      }
    }
  }
}
