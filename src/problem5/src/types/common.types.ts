// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginationQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── Generic ID ───────────────────────────────────────────────────────────────
export type ID = string;

// ─── Timestamps ───────────────────────────────────────────────────────────────
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sort ─────────────────────────────────────────────────────────────────────
export type SortOrder = 'asc' | 'desc';

// ─── Nullable helper ─────────────────────────────────────────────────────────
export type Nullable<T> = T | null;

// ─── Optional helper ─────────────────────────────────────────────────────────
export type Optional<T> = T | undefined;

// ─── Deep Partial ─────────────────────────────────────────────────────────────
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;
