import { zCreateCompanyDto } from './create-company.dto';
import { createZodDto } from 'nestjs-zod';

export const zUpdateCompanyDto = zCreateCompanyDto.partial();

export class UpdateCompanyDto extends createZodDto(zUpdateCompanyDto) {}
