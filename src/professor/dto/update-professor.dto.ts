import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { zCreateProfessorDto } from './create-professor.dto';

export const zUpdateProfessorDto = zCreateProfessorDto
  .extend({
    university: z.string().uuid().nonempty(),
  })
  .partial();

export class UpdateProfessorDto extends createZodDto(zUpdateProfessorDto) {}
