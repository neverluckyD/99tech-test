import { prisma } from '../../config/prisma';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource, ResourceListResult } from './resource.types';
import { PaginationQuery } from '../../types/common.types';

export class ResourceRepository {
  async findAll(pagination: PaginationQuery): Promise<ResourceListResult> {
    const { page, limit, search, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.resource.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Resource | null> {
    return prisma.resource.findUnique({ where: { id } });
  }

  async create(data: CreateResourceDto): Promise<Resource> {
    return prisma.resource.create({ data });
  }

  async update(id: string, data: UpdateResourceDto): Promise<Resource> {
    return prisma.resource.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.resource.delete({ where: { id } });
  }
}
