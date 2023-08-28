import { PaginationResultInterface } from './pagination-result.interface';

export class Pagination<PaginatedEntity> {
  public results: PaginatedEntity[];
  public currentPage: number;
  public pageSize: number;
  public totalItems: number;
  public next: number;
  public previous: number;
  public pagesTotal?: number;

  constructor(paginationResults: PaginationResultInterface<PaginatedEntity>) {
    this.results = paginationResults.results;
    this.currentPage = paginationResults.currentPage;
    this.pageSize = paginationResults.pageSize;
    this.totalItems = paginationResults.totalItems;
    this.next = paginationResults.next;
    this.previous = paginationResults.previous;
    this.pagesTotal = paginationResults.pagesTotal;
  }
}
