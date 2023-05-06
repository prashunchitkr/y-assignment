import { ZodParseIntPipe } from './zod-parse-int.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ZodParseIntPipe', () => {
  it('should validate a valid number', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodParseIntPipe();
    const testNumber = '123';

    // Act
    const result = zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toEqual(123);
  });

  it('should throw an error if the number is invalid', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodParseIntPipe();
    const testNumber = 'abc';

    // Act
    const result = () => zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toThrow(BadRequestException);
  });

  it('should throw an error if the number is negative', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodParseIntPipe();
    const testNumber = '-1';

    // Act
    const result = () => zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toThrow(BadRequestException);
  });

  it('should throw an error if the number is too large', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodParseIntPipe({ max: 10 });
    const testNumber = '101';

    // Act
    const result = () => zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toThrow(BadRequestException);
  });

  it('should throw an error if the number is too small', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodParseIntPipe({ min: 10 });
    const testNumber = '9';

    // Act
    const result = () => zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toThrow(BadRequestException);
  });

  it('should throw an error if the min is greater than the max', () => {
    // Arrange
    expect(() => new ZodParseIntPipe({ min: 10, max: 9 })).toThrow(Error);
  });

  it('should throw an error if the min is equal to the max', () => {
    // Arrange
    expect(() => new ZodParseIntPipe({ min: 10, max: 10 })).toThrow(Error);
  });

  it('should throw an error if no value is provided', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodParseIntPipe();
    const testNumber = undefined;

    // Act
    const result = () => zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toThrow(BadRequestException);
  });

  it('should throw an error if blank value is provided', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodParseIntPipe();
    const testNumber = '';

    // Act
    const result = () => zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toThrow(BadRequestException);
  });

  it('should return the default value if no value is provided', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodParseIntPipe({
      default: 10,
    });
    const testNumber = undefined;

    // Act
    const result = zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toEqual(10);
  });
});
