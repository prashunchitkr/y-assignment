import { zBaseDto } from '@/utils/dto/base.dto';
import { createZodDto } from 'nestjs-zod';

export const zStudentPreviewDto = zBaseDto.extend({
  university: zBaseDto.nullable().optional(),
  professor: zBaseDto.nullable().optional(),
});

export class StudentPreviewDto extends createZodDto(zStudentPreviewDto) {}
