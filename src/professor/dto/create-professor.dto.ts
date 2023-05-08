import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const zCreateProfessorDto = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  university: z.string().uuid().nonempty(),
});

export class CreateProfessorDto extends createZodDto(zCreateProfessorDto) {}
