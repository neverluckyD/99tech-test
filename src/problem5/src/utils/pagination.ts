import { ParsedQs } from 'qs';
import { PaginationQuery, PaginatedResult } from '../types/common.types';
import { env } from '../config/env';

/**
 * Parses raw query-string params into a typed PaginationQuery.
 */
export const parsePaginationQuery = (query: ParsedQs): PaginationQuery => {
  const page = Math.max(1, parseInt((query.page as string) ?? '1', 10) || 1);
  const rawLimit = parseInt(
    (query.limit as string) ?? String(env.DEFAULT_PAGE_SIZE),
    10,
  );
  const limit = Math.min(
    Math.max(1, isNaN(rawLimit) ? env.DEFAULT_PAGE_SIZE : rawLimit),
    env.MAX_PAGE_SIZE,
  );

  const sortOrder =
    (query.sortOrder as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';

  return {
    page,
    limit,
    search: (query.search as string) ?? undefined,
    sortBy: (query.sortBy as string) ?? 'createdAt',
    sortOrder,
  };
};

/**
 * Wraps a list of items with pagination metadata.
 */
export const paginate = <T>(
  items: T[],
  total: number,
  { page, limit }: PaginationQuery,
): PaginatedResult<T> => ({
  items,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNext: page < Math.ceil(total / limit),
  hasPrev: page > 1,
});
