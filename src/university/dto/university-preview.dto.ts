import { zBaseDto } from '@/utils/dto/base.dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const zUniversityPreview = zBaseDto.extend({
  students: z.array(zBaseDto).optional(),
  professors: z.array(zBaseDto).optional(),
});

export class UniversityPreviewDto extends createZodDto(zUniversityPreview) {}
