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
  UseInterceptors,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dtos/category-response.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { RecordNotFoundError } from 'src/core/errors/record-not-found.error';
import { UniqueConstraintError } from 'src/core/errors/unique-constraint.error';
import { Auth } from 'src/auth/guards/auth.guard';
import { Role } from 'src/users/role.model';
import { CacheService } from 'src/core/services/cache.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('categories')
@UseInterceptors(CacheInterceptor)
export class CategoriesController {
  constructor(
    private categoriesService: CategoriesService,
    private cacheService: CacheService,
  ) {}

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
  @Auth(Role.Admin, Role.Manager)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() form: CreateCategoryDto) {
    try {
      const category = await this.categoriesService.create(form);

      this.cacheService.del('/categories');

      return new CategoryResponseDto(category);
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        throw new UnprocessableEntityException(e.message);
      }
    }
  }

  @Patch(':id')
  @Auth(Role.Admin, Role.Manager)
  async update(@Param('id') id: number, @Body() form: UpdateCategoryDto) {
    try {
      const category = await this.categoriesService.update(id, form);

      this.cacheService.del('/categories');
      this.cacheService.del(`/categories/${id}`);

      return new CategoryResponseDto(category);
    } catch (e) {
      if (e instanceof RecordNotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  @Delete(':id')
  @Auth(Role.Admin, Role.Manager)
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id') id: number) {
    try {
      await this.categoriesService.destroy(id);

      this.cacheService.del('/categories');
      this.cacheService.del(`/categories/${id}`);
    } catch (e) {
      if (e instanceof RecordNotFoundError) {
        throw new NotFoundException();
      }
    }
  }
}
