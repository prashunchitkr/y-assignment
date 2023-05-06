import { BadRequestException } from '@nestjs/common';
import { ZodParseBoolPipe } from './zod-parse-bool.pipe';

describe('ZodParseBoolPipe', () => {
  const pipe = new ZodParseBoolPipe();

  it('should parse valid bool', () => {
    expect(pipe.transform('true')).toBe(true);
    expect(pipe.transform('false')).toBe(false);
  });

  it('should throw error for invalid input', () => {
    const invalidInputs = [1, '', 'thisisnotabool', 0.1, {}, []];

    invalidInputs.forEach((input) => {
      const result = () => pipe.transform(input);

      expect(result).toThrow(BadRequestException);
    });
  });

  it('should parse to false when null or undefined provided', () => {
    expect(pipe.transform(undefined)).toBe(false);
    expect(pipe.transform(null)).toBe(false);
  });
});
