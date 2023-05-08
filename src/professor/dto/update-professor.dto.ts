import { createZodDto } from 'nestjs-zod';
import { zCreateProfessorDto } from './create-professor.dto';

export const zUpdateProfessorDto = zCreateProfessorDto.partial();

export class UpdateProfessorDto extends createZodDto(zUpdateProfessorDto) {}
