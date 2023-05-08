import {
  CreateProfessorDto,
  ProfessorDto,
  ProfessorPreviewDto,
  UpdateProfessorDto,
} from './dto';

interface IFindAllQuery {
  skip?: number;
  take?: number;
  name?: string;
  description?: string;
  includeUniversity?: boolean;
  includeStudents?: boolean;
}

export abstract class IProfessorService {
  abstract create(
    createProfessorDto: CreateProfessorDto,
  ): Promise<ProfessorDto>;

  abstract findAll(query: IFindAllQuery): Promise<ProfessorPreviewDto[]>;

  abstract findOne(id: string): Promise<ProfessorDto | null>;

  abstract update(
    id: string,
    updateProfessorDto: UpdateProfessorDto,
  ): Promise<ProfessorDto>;

  abstract remove(id: string): Promise<void>;

  abstract findManyByIds(ids: string[]): Promise<ProfessorPreviewDto[]>;
}
