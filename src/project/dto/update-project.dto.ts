import { createZodDto } from 'nestjs-zod';
import { zCreateProjectDto } from './create-project.dto';

export const zUpdateProjectDto = zCreateProjectDto.partial();

export class UpdateProjectDto extends createZodDto(zUpdateProjectDto) {}
