import { BadRequestException, PipeTransform } from '@nestjs/common';
import { z, ZodError } from 'nestjs-zod/z';

export class ZodParseBoolPipe implements PipeTransform {
  readonly #boolSchema: z.ZodEffects<z.ZodString, boolean, string>;
  readonly #default: 'true' | 'false';

  constructor(defaultValue = false) {
    this.#boolSchema = z
      .string()
      .nonempty()
      .regex(/^(true|false)$/)
      .transform((value) => value === 'true');

    this.#default = defaultValue ? 'true' : 'false';
  }

  transform(value: unknown) {
    try {
      return this.#boolSchema.parse(value ?? this.#default);
    } catch (err) {
      if (err instanceof ZodError) throw new BadRequestException(err.message);
    }
  }
}
