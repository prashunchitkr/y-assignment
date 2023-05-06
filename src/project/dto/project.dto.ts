import { zCompanyDto } from '@/company/dto';
import { zBaseDto } from '@/utils/dto/base.dto';
import { createZodDto } from 'nestjs-zod';

export const zProjectDto = zBaseDto.extend({
  university: zBaseDto.optional(),
  company: zBaseDto.optional(),
});

export class CompanyDto extends createZodDto(zCompanyDto) {}
