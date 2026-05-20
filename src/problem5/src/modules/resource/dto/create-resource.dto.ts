import { ResourceStatus } from '../resource.types';

export interface CreateResourceDto {
  name: string;
  description?: string;
  status?: ResourceStatus;
}
