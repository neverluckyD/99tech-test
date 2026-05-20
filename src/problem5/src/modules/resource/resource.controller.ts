import { Request, Response } from 'express';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ApiResponse } from '../../utils/api-response';
import { HttpStatus } from '../../constants/http-status';
import { parsePaginationQuery } from '../../utils/pagination';

export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePaginationQuery(req.query);
    const result = await this.resourceService.findAll(pagination);
    res.status(HttpStatus.OK).json(ApiResponse.success(result));
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const resource = await this.resourceService.findById(id);
    res.status(HttpStatus.OK).json(ApiResponse.success(resource));
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const dto: CreateResourceDto = req.body;
    const resource = await this.resourceService.create(dto);
    res.status(HttpStatus.CREATED).json(ApiResponse.success(resource, 'Resource created'));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const dto: UpdateResourceDto = req.body;
    const resource = await this.resourceService.update(id, dto);
    res.status(HttpStatus.OK).json(ApiResponse.success(resource, 'Resource updated'));
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.resourceService.delete(id);
    res.status(HttpStatus.NO_CONTENT).send();
  };
}
