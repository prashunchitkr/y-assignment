import { zBaseDto } from '@/utils/dto/base.dto';
import { createZodDto } from 'nestjs-zod';

export const zProjectDto = zBaseDto.extend({
  university: zBaseDto.nullable().optional(),
  company: zBaseDto.nullable().optional(),
});

export class ProjectDto extends createZodDto(zProjectDto) {}
