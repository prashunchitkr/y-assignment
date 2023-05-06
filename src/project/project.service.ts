import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { ProjectDto } from './dto';
import { CompanyService } from '@/company/company.service';

@Injectable()
export class ProjectService {
  readonly previewSelector = {
    id: true,
    name: true,
    description: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
  ) {}

  /**
   * Create a project entity
   * @param createProjectDto  Data to create a project entity
   * @returns Newly created project entity
   */
  async create(createProjectDto: CreateProjectDto) {
    return await this.prisma.project.create({
      data: createProjectDto,
      select: this.previewSelector,
    });
  }

  findAll() {
    return `This action returns all project`;
  }

  /**
   * Get a project entity by id
   * @param id  Project id
   * @returns Project entity
   */
  async findOne(id: string): Promise<ProjectDto> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: {
        ...this.previewSelector,
        company: {
          select: this.companyService.previewSelector,
        },
        university: {
          select: this.previewSelector,
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

  async findCompanyProjects(companyId: string) {
    return await this.prisma.project.findMany({
      where: {
        company: {
          id: companyId,
        },
      },
      select: this.previewSelector,
    });
  }
}
