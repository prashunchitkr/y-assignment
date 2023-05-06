import { zBaseDto } from '@/utils/dto/base.dto';
import { createZodDto } from 'nestjs-zod';

export const zProjectPreviewDto = zBaseDto.extend({
  university: zBaseDto.optional(),
  company: zBaseDto.optional(),
});

export class ProjectPreviewDto extends createZodDto(zProjectPreviewDto) {}
