import { PrismaService } from '@/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ProfessorService } from '../professor.service';

describe('ProfessorService', () => {
  let service: ProfessorService;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessorService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<ProfessorService>(ProfessorService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of professors', async () => {
      const professors = [
        {
          id: '1',
          name: 'Test',
          description: 'Test description',
          universityId: null,
        },
      ];

      prismaService.professor.findMany.mockResolvedValue(professors);

      const foundProfessors = await service.findAll({});

      expect(foundProfessors).toBeDefined();
      expect(foundProfessors).toHaveLength(1);
      expect(foundProfessors).toStrictEqual(professors);
    });

    it('should return a list of professors with pagination', async () => {
      const professors = [
        {
          id: '1',
          name: 'Test',
          description: 'Test description',
          universityId: null,
        },
      ];

      prismaService.professor.findMany.mockResolvedValue(professors);

      const foundProfessors = await service.findAll({
        skip: 0,
        take: 10,
      });

      expect(foundProfessors).toBeDefined();
      expect(foundProfessors).toHaveLength(1);
      expect(foundProfessors).toStrictEqual(professors);
    });

    it('should return a list of professors with name', async () => {
      const professors = [
        {
          id: '1',
          name: 'Test',
          description: 'Test description',
          universityId: null,
        },
      ];

      prismaService.professor.findMany.mockResolvedValue(professors);

      const foundProfessors = await service.findAll({
        name: 'Test',
      });

      expect(foundProfessors).toBeDefined();
      expect(foundProfessors).toHaveLength(1);
      expect(foundProfessors).toStrictEqual(professors);
    });

    it('should return a list of professors with description', async () => {
      const professors = [
        {
          id: '1',
          name: 'Test',
          description: 'Test description',
          universityId: null,
        },
      ];

      prismaService.professor.findMany.mockResolvedValue(professors);

      const foundProfessors = await service.findAll({
        description: 'Test',
      });

      expect(foundProfessors).toBeDefined();
      expect(foundProfessors).toHaveLength(1);
      expect(foundProfessors).toStrictEqual(professors);
    });
  });

  describe('findOne', () => {
    it('should return a professor', async () => {
      const professor = {
        id: '1',
        name: 'Test',
        description: 'Test description',
        universityId: null,
      };

      prismaService.professor.findUnique.mockResolvedValue(professor);

      const foundProfessor = await service.findOne('1');

      expect(foundProfessor).not.toBeNull();
      expect(foundProfessor).toStrictEqual(professor);
    });

    it('should return null if the professor does not exist', async () => {
      prismaService.professor.findUnique.mockResolvedValue(null);

      const foundProfessor = await service.findOne('1');

      expect(foundProfessor).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a professor', async () => {
      const professor = {
        id: '1',
        name: 'Test',
        description: 'Test description',
        universityId: null,
      };

      prismaService.professor.findUnique.mockResolvedValue(professor);
      prismaService.professor.update.mockResolvedValue({
        ...professor,
        name: 'Test2',
      });

      const updatedProfessor = await service.update('1', {
        name: 'Test2',
      });

      expect(updatedProfessor).toBeDefined();
      expect(updatedProfessor.name).toBe('Test2');
    });

    it('should throw an error if the professor does not exist', async () => {
      prismaService.professor.findUnique.mockResolvedValue(null);

      await expect(service.update('1', {})).rejects.toThrow(
        'Professor not found',
      );
    });

    it('should throw an error if the university does not exist', async () => {
      const professor = {
        id: '1',
        name: 'Test',
        description: 'Test description',
        universityId: null,
      };

      prismaService.professor.findUnique.mockResolvedValue(professor);
      prismaService.university.findUnique.mockResolvedValue(null);

      await expect(
        service.update('1', {
          university: '1',
        }),
      ).rejects.toThrow('University not found');
    });

    it('should throw an error if the university has only one professor', async () => {
      const professor = {
        id: '1',
        name: 'Test',
        description: 'Test description',
        universityId: '1',
      };

      const university = {
        id: '1',
        name: 'Test',
        description: 'Test description',
      };

      prismaService.professor.findUnique.mockResolvedValue(professor);
      prismaService.university.findUnique.mockResolvedValue(university);
      prismaService.professor.count.mockResolvedValue(1);

      await expect(
        service.update('1', {
          university: '2',
        }),
      ).rejects.toThrow('Cannot remove the last professor from a university');
    });
  });

  describe('remove', () => {
    it('should remove a professor', async () => {
      const professor = {
        id: '1',
        name: 'Test',
        description: 'Test description',
        universityId: null,
      };

      prismaService.professor.findUnique.mockResolvedValue(professor);
      prismaService.professor.delete.mockResolvedValue(professor);

      expect(service.remove('1')).resolves.not.toThrow();
    });

    it('should throw an error if the professor does not exist', async () => {
      prismaService.professor.findUnique.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(
        'Professor with id 1 not found',
      );
    });
  });
});
