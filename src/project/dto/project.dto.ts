import { zBaseDto } from '@/utils/dto/base.dto';
import { createZodDto } from 'nestjs-zod';

export const zProjectDto = zBaseDto.extend({
  university: zBaseDto.optional().nullable(),
  company: zBaseDto.optional().nullable(),
});

export class ProjectDto extends createZodDto(zProjectDto) {}
