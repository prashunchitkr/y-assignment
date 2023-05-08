import { zBaseDto } from '@/utils/dto/base.dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const zProfessorPreviewDto = zBaseDto.extend({
  university: zBaseDto.nullable().optional(),
  students: z.array(zBaseDto).optional(),
});

export class ProfessorPreviewDto extends createZodDto(zProfessorPreviewDto) {}
