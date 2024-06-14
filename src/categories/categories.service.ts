import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { RecordNotFoundError } from 'src/core/errors/record-not-found.error';
import { UniqueConstraintError } from 'src/core/errors/unique-constraint.error';
import { PrismaService } from 'src/core/services/prisma.service';
import { slugify } from 'src/core/utils/slugify';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findById(categoryId: number) {
    return this.prisma.category.findUnique({ where: { id: categoryId } });
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  async create(form: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: {
          ...form,
          slug: slugify(form.name),
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new UniqueConstraintError(e.meta.target);
      }
    }
  }

  async update(categoryId: number, form: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id: categoryId },
        data: {
          ...form,
          slug: form.name ? slugify(form.name) : undefined,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new RecordNotFoundError();
      }
    }
  }

  async destroy(categoryId: number) {
    try {
      return await this.prisma.category.delete({ where: { id: categoryId } });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new RecordNotFoundError();
      }
    }
  }
}
