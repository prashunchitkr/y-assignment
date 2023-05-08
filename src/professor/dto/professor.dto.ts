import { zBaseDto } from '@/utils/dto/base.dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const zProfessor = zBaseDto.extend({
  university: zBaseDto.nullable(),
  students: z.array(zBaseDto),
});

export class ProfessorDto extends createZodDto(zProfessor) {}
