import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const zCreateUniversityDto = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  students: z.array(z.string().uuid().nonempty()).nonempty(),
  professors: z.array(z.string().uuid().nonempty()).nonempty(),
});

export class CreateUniversityDto extends createZodDto(zCreateUniversityDto) {}
