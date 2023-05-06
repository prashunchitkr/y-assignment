import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const zCreateProjectDto = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  company: z.string().uuid().nonempty().optional(),
  university: z.string().uuid().nonempty().optional(),
});

export class CreateProjectDto extends createZodDto(zCreateProjectDto) {}
