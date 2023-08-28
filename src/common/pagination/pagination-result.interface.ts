/**
 * GENERIC INTERFACE FOR PAGINATION RESULTS
 */
export interface PaginationResultInterface<PaginatedEntity> {
  results: PaginatedEntity[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  next: number;
  previous: number;
  pagesTotal?: number;
}
