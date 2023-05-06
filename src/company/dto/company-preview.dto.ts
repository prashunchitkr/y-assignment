import { zBaseDto } from '@/utils/dto/base.dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const zCompanyPreviewDto = zBaseDto.extend({
  projects: z.array(zBaseDto).optional(),
});

export class CompanyPreviewDto extends createZodDto(zCompanyPreviewDto) {}
