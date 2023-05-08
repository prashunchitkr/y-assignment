import {
  CreateProjectDto,
  ProjectDto,
  ProjectPreviewDto,
  UpdateProjectDto,
} from './dto';

interface IFindAllQuery {
  skip?: number;
  take?: number;
  name?: string;
  description?: string;
  includeCompany?: boolean;
  includeUniversity?: boolean;
}

export abstract class IProjectService {
  abstract create(createProjectDto: CreateProjectDto): Promise<ProjectDto>;

  abstract findAll(query: IFindAllQuery): Promise<ProjectPreviewDto[]>;

  abstract findOne(id: string): Promise<ProjectDto | null>;

  abstract update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectDto>;

  abstract remove(id: string): Promise<void>;
}
