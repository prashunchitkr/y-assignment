import { zBaseDto } from '@/utils/dto/base.dto';
import { createZodDto } from 'nestjs-zod';

export const zStudentDto = zBaseDto.extend({
  university: zBaseDto.nullable(),
  professor: zBaseDto.nullable(),
});

export class StudentDto extends createZodDto(zStudentDto) {}
