import { zBaseDto } from '@/utils/dto/base.dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const zUniversityDto = zBaseDto.extend({
  students: z.array(zBaseDto),
  professors: z.array(zBaseDto),
});

export class UniversityDto extends createZodDto(zUniversityDto) {}
