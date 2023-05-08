import {
  CompanyDto,
  CompanyPreviewDto,
  CreateCompanyDto,
  UpdateCompanyDto,
} from './dto';

export interface IFindAllQuery {
  skip?: number;
  take?: number;
  name?: string;
  description?: string;
  includeProjects?: boolean;
}

export abstract class ICompanyService {
  abstract create(
    createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyPreviewDto>;

  abstract findAll(query: IFindAllQuery): Promise<CompanyPreviewDto[]>;

  abstract findOne(id: string): Promise<CompanyDto | null>;

  abstract update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyDto>;

  abstract remove(id: string): Promise<void>;
}
