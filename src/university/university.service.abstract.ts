import {
  CreateUniversityDto,
  UniversityDto,
  UniversityPreviewDto,
  UpdateUniversityDto,
} from './dto';

export interface IFindAllQuery {
  skip?: number;
  take?: number;
  name?: string;
  description?: string;
  includeStudents?: boolean;
  includeProfessors?: boolean;
}

export abstract class IUniversityService {
  abstract create(
    createUniversityDto: CreateUniversityDto,
  ): Promise<UniversityPreviewDto>;

  abstract findAll(query: IFindAllQuery): Promise<UniversityPreviewDto[]>;

  abstract findOne(id: string): Promise<UniversityDto | null>;

  abstract update(
    id: string,
    updateUniversityDto: UpdateUniversityDto,
  ): Promise<UniversityDto>;

  abstract remove(id: string): Promise<void>;
}
