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
  UnprocessableEntityException,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dtos/category-response.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { RecordNotFoundError } from 'src/core/errors/record-not-found.error';
import { UniqueConstraintError } from 'src/core/errors/unique-constraint.error';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();

    return categories.map((c) => new CategoryResponseDto(c));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const category = await this.categoriesService.findById(id);

    if (!category) throw new NotFoundException();

    return new CategoryResponseDto(category);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() form: CreateCategoryDto) {
    try {
      const category = await this.categoriesService.create(form);

      return new CategoryResponseDto(category);
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        throw new UnprocessableEntityException(e.message);
      }
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() form: UpdateCategoryDto) {
    try {
      const category = await this.categoriesService.update(id, form);

      return new CategoryResponseDto(category);
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
      return await this.categoriesService.destroy(id);
    } catch (e) {
      if (e instanceof RecordNotFoundError) {
        throw new NotFoundException();
      }
    }
  }
}