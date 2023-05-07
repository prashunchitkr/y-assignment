import { zBaseDto } from '@/utils/dto/base.dto';
import { createZodDto } from 'nestjs-zod';

export const zStuentPreviewDto = zBaseDto.extend({
  university: zBaseDto.nullable().optional(),
  professor: zBaseDto.nullable().optional(),
});

export class StuentPreviewDto extends createZodDto(zStuentPreviewDto) {}
