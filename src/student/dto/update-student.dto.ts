import { createZodDto } from 'nestjs-zod';
import { zCreateStudentDto } from './create-student.dto';

export const zUpdateStudentDto = zCreateStudentDto.partial();

export class UpdateStudentDto extends createZodDto(zUpdateStudentDto) {}
