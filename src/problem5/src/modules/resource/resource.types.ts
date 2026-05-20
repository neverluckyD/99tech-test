export type ResourceStatus = 'ACTIVE' | 'INACTIVE';

export interface Resource {
  id: string;
  name: string;
  description: string | null;
  status: ResourceStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceListResult {
  items: Resource[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
