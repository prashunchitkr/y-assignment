import { zBaseDto } from '@/utils/dto/base.dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const zCompanyDto = zBaseDto.extend({
  projects: z.array(zBaseDto),
});

export class CompanyDto extends createZodDto(zCompanyDto) {}
