import { ResourceStatus } from '../resource.types';

export interface UpdateResourceDto {
  name?: string;
  description?: string;
  status?: ResourceStatus;
}
