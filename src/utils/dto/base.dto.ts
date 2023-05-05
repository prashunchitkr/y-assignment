import { z } from 'nestjs-zod/z';

export const zBaseDto = z.object({
  id: z.string().uuid().nonempty(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
});
