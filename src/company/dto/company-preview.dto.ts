import { zBaseDto } from '@/utils/dto/base.dto';
import { createZodDto } from 'nestjs-zod';

export const zCompanyPreviewDto = zBaseDto;

export class CompanyPreviewDto extends createZodDto(zCompanyPreviewDto) {}
