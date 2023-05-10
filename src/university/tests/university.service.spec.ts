import { PrismaService } from '@/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UniversityService } from '../university.service';

describe('UniversityService', () => {
  let service: UniversityService;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UniversityService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<UniversityService>(UniversityService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should fail if one or more students are not found', async () => {
      prismaService.student.findMany.mockResolvedValueOnce([
        {
          id: 'student-1',
          name: 'Student 1',
          description: 'Description 1',
          professorId: null,
          universityId: null,
        },
      ]);

      await expect(
        service.create({
          name: 'University 1',
          description: 'Description 1',
          students: ['student-1', 'student-2'],
          professors: ['professor-1'],
        }),
      ).rejects.toThrowError('One or more students were not found');
    });

    it('should fail if one or more professors are not found', async () => {
      prismaService.student.findMany.mockResolvedValueOnce([
        {
          id: 'student-1',
          name: 'Student 1',
          description: 'Description 1',
          professorId: null,
          universityId: null,
        },
      ]);

      prismaService.professor.findMany.mockResolvedValueOnce([
        {
          id: 'professor-1',
          name: 'Professor 1',
          description: 'Description 1',
          universityId: null,
        },
      ]);

      await expect(
        service.create({
          name: 'University 1',
          description: 'Description 1',
          students: ['student-1'],
          professors: ['professor-1', 'professor-2'],
        }),
      ).rejects.toThrowError('One or more professors were not found');
    });

    it('should create a university', async () => {
      prismaService.student.findMany.mockResolvedValueOnce([
        {
          id: 'student-1',
          name: 'Student 1',
          description: 'Description 1',
          professorId: null,
          universityId: null,
        },
      ]);

      prismaService.professor.findMany.mockResolvedValueOnce([
        {
          id: 'professor-1',
          name: 'Professor 1',
          description: 'Description 1',
          universityId: null,
        },
      ]);

      prismaService.university.create.mockResolvedValueOnce({
        id: 'university-1',
        name: 'University 1',
        description: 'Description 1',
      });

      const result = await service.create({
        name: 'University 1',
        description: 'Description 1',
        students: ['student-1'],
        professors: ['professor-1'],
      });

      expect(result).toEqual({
        id: 'university-1',
        name: 'University 1',
        description: 'Description 1',
      });
    });
  });

  describe('update', () => {
    it('should fail if the university is not found', async () => {
      prismaService.university.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.update('university-1', {
          name: 'University 1',
          description: 'Description 1',
        }),
      ).rejects.toThrowError('University not found');
    });

    it('should update a university', async () => {
      prismaService.university.findUnique.mockResolvedValueOnce({
        id: 'university-1',
        name: 'University 1',
        description: 'Description 1',
      });

      prismaService.university.update.mockResolvedValueOnce({
        id: 'university-1',
        name: 'University 2',
        description: 'Description 2',
      });

      const result = await service.update('university-1', {
        name: 'University 2',
        description: 'Description 2',
      });

      expect(result).toEqual({
        id: 'university-1',
        name: 'University 2',
        description: 'Description 2',
      });
    });
  });
});
