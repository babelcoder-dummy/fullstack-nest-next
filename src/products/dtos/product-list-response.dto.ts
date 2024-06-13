import { Expose, Type } from 'class-transformer';
import { PaginationMetaDto } from 'src/core/dtos/pagination-meta.dto';
import { ProductResponseDto } from './product-response.dto';

export class ProductListResponseDto {
  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;

  @Expose()
  @Type(() => ProductResponseDto)
  items: ProductResponseDto[];

  constructor(itemsPaging: ProductListResponseDto) {
    Object.assign(this, itemsPaging);
  }
}
