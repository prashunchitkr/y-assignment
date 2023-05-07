import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiSearchDecorator() {
  return applyDecorators(
    ApiQuery({
      name: 'skip',
      required: false,
      type: Number,
      description: 'Number of records to skip',
    }),
    ApiQuery({
      name: 'take',
      required: false,
      type: Number,
      description: 'Number of records to take',
    }),
    ApiQuery({
      name: 'name',
      required: false,
      type: String,
      description: 'Search by name',
    }),
    ApiQuery({
      name: 'description',
      required: false,
      type: String,
      description: 'Search by description',
    }),
  );
}
