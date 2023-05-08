import {
  CreateStudentDto,
  StudentDto,
  StudentPreviewDto,
  UpdateStudentDto,
} from './dto';

export interface IFindAllQuery {
  skip?: number;
  take?: number;
  name?: string;
  description?: string;
  includeUniversity?: boolean;
  includeProfessor?: boolean;
}

export abstract class IStudentService {
  abstract create(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentPreviewDto>;

  abstract findAll(query: IFindAllQuery): Promise<StudentPreviewDto[]>;

  abstract findOne(id: string): Promise<StudentDto | null>;

  abstract update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDto>;

  abstract remove(id: string): Promise<void>;

  abstract studentExists(id: string): Promise<boolean>;

  abstract getProfessorStudents(
    professorId: string,
  ): Promise<StudentPreviewDto[]>;

  abstract findManyByIds(ids: string[]): Promise<StudentPreviewDto[]>;
}
