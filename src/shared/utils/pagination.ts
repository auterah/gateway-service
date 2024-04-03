import { CalcPaginationType, PaginationData } from '../types/pagination';

export const get_duration_in_milliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

export const calculate_pagination = (
  page: number,
  size: number,
): CalcPaginationType => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  return {
    limit,
    offset,
  };
};

export const calculate_pagination_data = (
  data: any[],
  page: number,
  limit: number,
): PaginationData => {
  const [records, totalItems] = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  const pagination = calculate_pagination(page, limit);

  return {
    records,
    pagination: {
      totalItems,
      totalPages,
      currentPage,
      ...pagination,
    },
  };
};
