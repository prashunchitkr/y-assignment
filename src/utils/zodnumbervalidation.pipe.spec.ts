import { ZodNumberValiatonPipe } from './zod-number-validation.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ZodNumberValidationPipe', () => {
  it('should validate a valid number', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodNumberValiatonPipe();
    const testNumber = '123';

    // Act
    const result = zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toEqual(123);
  });

  it('should throw an error if the number is invalid', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodNumberValiatonPipe();
    const testNumber = 'abc';

    // Act
    const result = () => zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toThrow(BadRequestException);
  });

  it('should throw an error if the number is negative', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodNumberValiatonPipe();
    const testNumber = '-1';

    // Act
    const result = () => zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toThrow(BadRequestException);
  });

  it('should throw an error if the number is too large', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodNumberValiatonPipe({ max: 10 });
    const testNumber = '101';

    // Act
    const result = () => zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toThrow(BadRequestException);
  });

  it('should throw an error if the number is too small', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodNumberValiatonPipe({ min: 10 });
    const testNumber = '9';

    // Act
    const result = () => zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toThrow(BadRequestException);
  });

  it('should throw an error if the min is greater than the max', () => {
    // Arrange
    expect(() => new ZodNumberValiatonPipe({ min: 10, max: 9 })).toThrow(Error);
  });

  it('should throw an error if the min is equal to the max', () => {
    // Arrange
    expect(() => new ZodNumberValiatonPipe({ min: 10, max: 10 })).toThrow(
      Error,
    );
  });

  it('should throw an error if no value is provided', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodNumberValiatonPipe();
    const testNumber = undefined;

    // Act
    const result = () => zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toThrow(BadRequestException);
  });

  it('should throw an error if blank value is provided', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodNumberValiatonPipe();
    const testNumber = '';

    // Act
    const result = () => zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toThrow(BadRequestException);
  });

  it('should return the default value if no value is provided', () => {
    // Arrange
    const zodNumberValidationPipe = new ZodNumberValiatonPipe({
      default: 10,
    });
    const testNumber = undefined;

    // Act
    const result = zodNumberValidationPipe.transform(testNumber);

    // Assert
    expect(result).toEqual(10);
  });
});
