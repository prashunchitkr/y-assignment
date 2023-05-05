import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const zCreateCompanyDto = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
});

export class CreateCompanyDto extends createZodDto(zCreateCompanyDto) {}
