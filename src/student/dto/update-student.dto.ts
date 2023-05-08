import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { zCreateStudentDto } from './create-student.dto';

export const zUpdateStudentDto = zCreateStudentDto
  .extend({
    professor: z.string().uuid().nonempty(),
    university: z.string().uuid().nonempty(),
  })
  .partial();

export class UpdateStudentDto extends createZodDto(zUpdateStudentDto) {}
