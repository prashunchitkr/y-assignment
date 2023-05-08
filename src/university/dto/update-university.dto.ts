import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const zUpdateUniversityDto = z
  .object({
    name: z.string().nonempty(),
    description: z.string().nonempty(),
  })
  .partial();

export class UpdateUniversityDto extends createZodDto(zUpdateUniversityDto) {}
