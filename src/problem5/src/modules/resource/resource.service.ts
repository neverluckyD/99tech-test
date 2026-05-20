import { ResourceRepository } from './resource.repository';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource, ResourceListResult } from './resource.types';
import { PaginationQuery } from '../../types/common.types';
import { HttpStatus } from '../../constants/http-status';

export class ResourceService {
  constructor(private readonly resourceRepository: ResourceRepository) {}

  async findAll(pagination: PaginationQuery): Promise<ResourceListResult> {
    return this.resourceRepository.findAll(pagination);
  }

  async findById(id: string): Promise<Resource> {
    const resource = await this.resourceRepository.findById(id);

    if (!resource) {
      const error = Object.assign(new Error('Resource not found'), {
        statusCode: HttpStatus.NOT_FOUND,
      });
      throw error;
    }

    return resource;
  }

  async create(dto: CreateResourceDto): Promise<Resource> {
    return this.resourceRepository.create(dto);
  }

  async update(id: string, dto: UpdateResourceDto): Promise<Resource> {
    await this.findById(id); // ensure exists
    return this.resourceRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // ensure exists
    await this.resourceRepository.delete(id);
  }
}
