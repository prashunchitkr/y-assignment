import { PrismaService } from '@/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { StudentService } from '../student.service';

describe('StudentService', () => {
  let service: StudentService;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<StudentService>(StudentService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should throw an error if the student does not exist', async () => {
      prismaService.student.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.update('id', { university: 'universityId' }),
      ).rejects.toThrowError('Student not found');
    });

    it('should throw an error if the university does not exist', async () => {
      prismaService.student.findUnique.mockResolvedValueOnce({
        id: 'id',
        name: 'name',
        description: 'description',
        universityId: null,
        professorId: null,
      });

      prismaService.university.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.update('id', { university: 'universityId' }),
      ).rejects.toThrowError('University not found');
    });

    it('should throw an error if the university has only one student', async () => {
      prismaService.student.findUnique.mockResolvedValueOnce({
        id: 'id',
        name: 'name',
        description: 'description',
        universityId: 'universityId',
        professorId: null,
      });

      prismaService.university.findUnique.mockResolvedValueOnce({
        id: 'universityId',
        name: 'name',
        description: 'description',
      });

      prismaService.student.count.mockResolvedValueOnce(1);

      await expect(
        service.update('id', { university: 'universityId' }),
      ).rejects.toThrowError('University must have at least one student');
    });

    it('should throw an error if the professor does not exist', async () => {
      prismaService.student.findUnique.mockResolvedValueOnce({
        id: 'id',
        name: 'name',
        description: 'description',
        universityId: null,
        professorId: null,
      });

      prismaService.professor.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.update('id', { professor: 'professorId' }),
      ).rejects.toThrowError('Professor not found');
    });
  });

  describe('remove', () => {
    it('should throw an error if the student does not exist', async () => {
      prismaService.student.findUnique.mockResolvedValueOnce(null);

      await expect(service.remove('id')).rejects.toThrowError(
        'Student not found',
      );
    });

    it('should create a student', async () => {
      prismaService.student.findUnique.mockResolvedValueOnce({
        id: 'id',
        name: 'name',
        description: 'description',
        universityId: null,
        professorId: null,
      });

      await service.remove('id');

      expect(prismaService.student.delete).toHaveBeenCalledWith({
        where: { id: 'id' },
      });
    });
  });
});
