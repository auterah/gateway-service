export interface CalcPaginationType {
  limit: number;
  offset: number;
}

export interface ResultSetMeta {
  limit: number;
  offset: number;
  page: number;
  date1?: any;
  date2?: any;
}

export interface PaginationData {
  records?: [];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    offset: number;
  };
}
