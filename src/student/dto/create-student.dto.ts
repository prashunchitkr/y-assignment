import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const zCreateStudentDto = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  university: z.string().uuid().nonempty(),
  professor: z.string().uuid().nonempty(),
});

export class CreateStudentDto extends createZodDto(zCreateStudentDto) {}
