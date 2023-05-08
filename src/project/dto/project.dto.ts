import { zBaseDto } from '@/utils/dto/base.dto';
import { createZodDto } from 'nestjs-zod';

export const zProjectDto = zBaseDto.extend({
  university: zBaseDto.nullable(),
  company: zBaseDto.nullable(),
});

export class ProjectDto extends createZodDto(zProjectDto) {}
