import { BadRequestException, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

class ZodValidationPipeOptions {
  min?: number;
  max?: number;
  default?: number;
}

export class ZodNumberValiatonPipe implements PipeTransform {
  readonly #numericStringSchema: z.ZodEffects<
    z.ZodEffects<z.ZodString, number, string>,
    number,
    string
  >;

  constructor(private readonly options?: ZodValidationPipeOptions) {
    if (options?.min && options?.max && options.min >= options.max) {
      throw new Error('Min must be less than max');
    }
    this.#numericStringSchema = z
      .string()
      .regex(/^\d+$/)
      .transform((value) => parseInt(value, 10))
      .transform((n) => {
        if (this.options?.min && n < this.options.min) {
          throw new Error(`Number must be greater than ${this.options.min}`);
        }
        if (this.options?.max && n > this.options.max) {
          throw new Error(`Number must be less than ${this.options.max}`);
        }
        return n;
      });
  }

  transform(value: unknown) {
    try {
      if (!value) {
        if (this.options && this.options.default && this.options.default >= 0) {
          return this.options.default;
        }
        throw new Error('Value must be provided');
      }
      return this.#numericStringSchema.parse(value);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException(
          error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        );
      } else if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }
}
